'use client'

import { use } from 'react'
import { useLesson } from '@/hooks/useLessons'
import { LessonDetail } from '@/components/lessons/LessonDetail'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: lesson, isLoading } = useLesson(id)

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading lesson...</p>
            </div>
          </div>
        ) : lesson ? (
          <LessonDetail lesson={lesson} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Lesson not found</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

