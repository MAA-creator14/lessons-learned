'use client'

import { use } from 'react'
import { useLesson } from '@/hooks/useLessons'
import { LessonForm } from '@/components/lessons/LessonForm'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: lesson, isLoading } = useLesson(id)

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Lesson</h1>
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading lesson...</p>
              </div>
            </div>
          ) : lesson ? (
            <LessonForm lesson={lesson} />
          ) : (
            <p className="text-gray-600">Lesson not found</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

