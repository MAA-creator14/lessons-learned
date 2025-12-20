'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Edit, Trash2, Calendar, Tag as TagIcon, ArrowLeft } from 'lucide-react'
import { deleteLesson } from '@/app/actions/lessons'
import Link from 'next/link'
import type { Lesson, Category, Tag } from '@/app/generated/prisma/client'

interface LessonDetailProps {
  lesson: Lesson & {
    category: Category | null
    tags: Tag[]
  }
}

export function LessonDetail({ lesson }: LessonDetailProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteLesson(lesson.id)

    if (result.success) {
      router.push('/')
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete lesson')
      setIsDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to lessons
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(lesson.date), 'MMMM d, yyyy')}</span>
              </div>
              {lesson.category && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">
                  {lesson.category.name}
                </span>
              )}
              {lesson.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <TagIcon className="h-4 w-4" />
                  <div className="flex flex-wrap gap-2">
                    {lesson.tags.map((tag: Tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full bg-gray-100 px-3 py-1 text-gray-700"
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
              className="flex items-center space-x-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>

        {lesson.context && (
          <div className="mb-6 rounded-md bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">Context</p>
            <p className="mt-1 text-sm text-gray-600">{lesson.context}</p>
          </div>
        )}

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700">{lesson.content}</div>
        </div>
      </div>
    </div>
  )
}

