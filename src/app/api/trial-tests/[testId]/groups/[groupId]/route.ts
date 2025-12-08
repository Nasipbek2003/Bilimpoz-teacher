import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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
    
    const group = await prisma.trial_question_groups.findUnique({
      where: {
        id: groupId,
        trial_test_id: testId
      }
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error fetching trial question group:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const { title, description, total_questions, time_limit, text_rac } = body

    const updatedGroup = await prisma.trial_question_groups.update({
      where: {
        id: groupId,
        trial_test_id: testId
      },
      data: {
        title,
        description,
        total_questions,
        time_limit,
        text_rac
      }
    })

    return NextResponse.json(updatedGroup)
  } catch (error) {
    console.error('Error updating trial question group:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
