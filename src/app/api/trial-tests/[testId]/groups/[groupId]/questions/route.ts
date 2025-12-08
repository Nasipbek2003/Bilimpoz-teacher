import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// Настройка AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

interface RACText {
  id: 'text-1' | 'text-2' | 'text-3'
  content: string
  question_ids: string[]
}

interface RACBlock {
  id: string
  textId: 'text-1' | 'text-2' | 'text-3'
  question: string
  answers: Array<{
    text: string
    isCorrect: boolean
  }>
  points: number
  timeLimit: number
  imageUrl?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string; groupId: string }> }
) {
  try {
    const user = await auth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { testId, groupId } = await params
    
    // Получаем группу вопросов
    const group = await prisma.trial_question_groups.findUnique({
      where: {
        id: groupId,
        trial_test_id: testId
      }
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    // Если это RAC группа, загружаем тексты из S3
    if (group.subject === 'rac') {
      const racTexts: RACText[] = []
      
      for (let i = 1; i <= 3; i++) {
        try {
          const key = `trial-tests/rac-texts/rac-text-${i}-${groupId}.md`
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key
          })
          
          const response = await s3Client.send(command)
          const content = await response.Body?.transformToString('utf-8') || ''
          
          racTexts.push({
            id: `text-${i}` as 'text-1' | 'text-2' | 'text-3',
            content,
            question_ids: []
          })
        } catch (error) {
          // Если файл не найден, добавляем пустой текст
          racTexts.push({
            id: `text-${i}` as 'text-1' | 'text-2' | 'text-3',
            content: '',
            question_ids: []
          })
        }
      }

      return NextResponse.json({
        group,
        racTexts,
        racBlocks: [] // TODO: Загрузить блоки вопросов из БД
      })
    }

    return NextResponse.json({ group })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string; groupId: string }> }
) {
  try {
    const user = await auth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { testId, groupId } = await params
    const body = await request.json()
    const { racTexts, racBlocks }: { racTexts: RACText[], racBlocks: RACBlock[] } = body

    // Получаем группу вопросов
    const group = await prisma.trial_question_groups.findUnique({
      where: {
        id: groupId,
        trial_test_id: testId
      }
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    if (group.subject !== 'rac') {
      return NextResponse.json({ error: 'Not a RAC group' }, { status: 400 })
    }

    // Сохраняем тексты в S3
    if (racTexts && racTexts.length > 0) {
      for (const text of racTexts) {
        const textNumber = text.id.split('-')[1]
        const key = `trial-tests/rac-texts/rac-text-${textNumber}-${groupId}.md`
        
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
          Body: text.content,
          ContentType: 'text/markdown',
          Metadata: {
            groupId: groupId,
            textId: text.id,
            updatedAt: new Date().toISOString()
          }
        })
        
        await s3Client.send(command)
      }
    }

    // TODO: Сохранить блоки вопросов в базу данных
    // Здесь нужно будет создать таблицу для хранения вопросов RAC

    // Обновляем поле text_rac в группе (можно использовать для хранения метаданных)
    await prisma.trial_question_groups.update({
      where: {
        id: groupId
      },
      data: {
        text_rac: JSON.stringify({
          textsCount: racTexts?.length || 0,
          blocksCount: racBlocks?.length || 0,
          updatedAt: new Date().toISOString()
        })
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'RAC data saved successfully',
      textsCount: racTexts?.length || 0,
      blocksCount: racBlocks?.length || 0
    })
  } catch (error) {
    console.error('Error saving RAC data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
