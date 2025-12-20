'use client'

import { LessonForm } from '@/components/lessons/LessonForm'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function NewLessonPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Create New Lesson</h1>
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <LessonForm />
        </div>
      </div>
    </ProtectedRoute>
  )
}

