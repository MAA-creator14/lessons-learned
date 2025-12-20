'use client'

import { useState } from 'react'
import { useLessons } from '@/hooks/useLessons'
import { useCategories } from '@/hooks/useCategories'
import { useTags } from '@/hooks/useTags'
import { useDeleteLesson } from '@/hooks/useLessons'
import { LessonList } from '@/components/lessons/LessonList'
import { SearchBar } from '@/components/search/SearchBar'
import { FilterBar } from '@/components/filters/FilterBar'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: lessons = [], isLoading } = useLessons({
    search: searchQuery || undefined,
    categoryId: selectedCategoryId,
    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    sortBy,
    sortOrder,
  })

  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()
  const deleteLessonMutation = useDeleteLesson()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      await deleteLessonMutation.mutateAsync(id)
    }
  }

  const handleClearFilters = () => {
    setSelectedCategoryId(undefined)
    setSelectedTagIds([])
    setSearchQuery('')
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Lessons Learned</h1>
          <p className="mt-2 text-gray-600">
            Capture, store, and review lessons from your work and personal projects.
          </p>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FilterBar
              categories={categories}
              tags={tags}
              selectedCategoryId={selectedCategoryId}
              selectedTagIds={selectedTagIds}
              onCategoryChange={setSelectedCategoryId}
              onTagChange={setSelectedTagIds}
              onClear={handleClearFilters}
            />

            <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
              <label className="block text-sm font-medium text-gray-700">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="date">Lesson Date</option>
                <option value="title">Title</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-3">
            <LessonList
              lessons={lessons}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
