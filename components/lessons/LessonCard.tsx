'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Edit, Trash2, Calendar, Tag as TagIcon } from 'lucide-react'
import type { Lesson, Category, Tag } from '@/app/generated/prisma/client'

interface LessonCardProps {
  lesson: Lesson & {
    category: Category | null
    tags: Tag[]
  }
  onDelete?: (id: string) => void
}

export function LessonCard({ lesson, onDelete }: LessonCardProps) {
  const contentPreview = lesson.content.length > 150
    ? `${lesson.content.substring(0, 150)}...`
    : lesson.content

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={`/lessons/${lesson.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {lesson.title}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-gray-600">{contentPreview}</p>

          {lesson.context && (
            <p className="mt-2 text-xs text-gray-500">Context: {lesson.context}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(lesson.date), 'MMM d, yyyy')}</span>
            </div>
            {lesson.category && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">
                {lesson.category.name}
              </span>
            )}
            {lesson.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <TagIcon className="h-3 w-3" />
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-gray-100 px-2 py-1 text-gray-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ml-4 flex space-x-2">
          <Link
            href={`/lessons/${lesson.id}/edit`}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
            title="Edit lesson"
          >
            <Edit className="h-4 w-4" />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(lesson.id)}
              className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
              title="Delete lesson"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

