'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { createLesson, updateLesson } from '@/app/actions/lessons'
import { useCategories } from '@/hooks/useCategories'
import { getTags } from '@/app/actions/tags'
import { CreateCategoryModal } from '@/components/categories/CreateCategoryModal'
import type { CreateLessonInput } from '@/lib/validations/lesson'
import type { Lesson, Category, Tag } from '@/app/generated/prisma/client'

interface LessonFormProps {
  lesson?: Lesson & {
    category: Category | null
    tags: Tag[]
  }
}

export function LessonForm({ lesson }: LessonFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { data: categories = [] } = useCategories()
  const [tags, setTags] = useState<{ id: string; name: string }[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [formData, setFormData] = useState<CreateLessonInput>({
    title: lesson?.title || '',
    content: lesson?.content || '',
    context: lesson?.context || '',
    date: lesson?.date ? new Date(lesson.date) : new Date(),
    categoryId: lesson?.categoryId || undefined,
    tagIds: lesson?.tags.map((t: Tag) => t.id) || [],
  })

  useEffect(() => {
    async function loadTags() {
      const tagsResult = await getTags()
      if (tagsResult.success) setTags(tagsResult.data)
    }
    loadTags()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = lesson
        ? await updateLesson({ ...formData, id: lesson.id })
        : await createLesson(formData)

      if (result.success) {
        router.push(lesson ? `/lessons/${lesson.id}` : '/')
        router.refresh()
      } else {
        setError(result.error || 'Failed to save lesson')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content *
        </label>
        <textarea
          id="content"
          required
          rows={8}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="context" className="block text-sm font-medium text-gray-700">
          Context (Project/Where you learned this)
        </label>
        <input
          type="text"
          id="context"
          value={formData.context || ''}
          onChange={(e) => setFormData({ ...formData, context: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
          onChange={(e) => setFormData({ ...formData, date: e.target.value ? new Date(e.target.value) : undefined })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Category</span>
          </button>
        </div>
        <select
          id="category"
          value={formData.categoryId || ''}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || undefined })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <CreateCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onCategoryCreated={(categoryId) => {
          setFormData({ ...formData, categoryId })
          setShowCategoryModal(false)
        }}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-2 space-y-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.tagIds?.includes(tag.id) || false}
                onChange={(e) => {
                  const currentTagIds = formData.tagIds || []
                  if (e.target.checked) {
                    setFormData({ ...formData, tagIds: [...currentTagIds, tag.id] })
                  } else {
                    setFormData({
                      ...formData,
                      tagIds: currentTagIds.filter((id) => id !== tag.id),
                    })
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : lesson ? 'Update Lesson' : 'Create Lesson'}
        </button>
      </div>
    </form>
  )
}

