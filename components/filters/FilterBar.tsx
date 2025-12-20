'use client'

import { X } from 'lucide-react'

interface FilterBarProps {
  categories: { id: string; name: string }[]
  tags: { id: string; name: string }[]
  selectedCategoryId?: string
  selectedTagIds: string[]
  onCategoryChange: (categoryId: string | undefined) => void
  onTagChange: (tagIds: string[]) => void
  onClear: () => void
}

export function FilterBar({
  categories,
  tags,
  selectedCategoryId,
  selectedTagIds,
  onCategoryChange,
  onTagChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilters = selectedCategoryId || selectedTagIds.length > 0

  const handleTagToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagChange(selectedTagIds.filter((id) => id !== tagId))
    } else {
      onTagChange([...selectedTagIds, tagId])
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => onCategoryChange(e.target.value || undefined)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-2 max-h-40 space-y-2 overflow-y-auto">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

