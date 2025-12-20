'use client'

import { LessonCard } from './LessonCard'
import { BookOpen } from 'lucide-react'
import type { Lesson, Category, Tag } from '@/app/generated/prisma/client'

interface LessonListProps {
  lessons: (Lesson & {
    category: Category | null
    tags: Tag[]
  })[]
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function LessonList({ lessons, onDelete, isLoading }: LessonListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No lessons found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by creating your first lesson.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} onDelete={onDelete} />
      ))}
    </div>
  )
}

