'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import TeacherLayout from '@/components/teacher/TeacherLayout'
import TrialGroupQuestionsPage from '@/components/teacher/TrialGroupQuestionsPage'

export default function TrialGroupQuestionsPageRoute() {
  const params = useParams()
  const testId = params.testId as string
  const groupId = params.groupId as string

  return (
    <TeacherLayout>
      <TrialGroupQuestionsPage testId={testId} groupId={groupId} />
    </TeacherLayout>
  )
}








