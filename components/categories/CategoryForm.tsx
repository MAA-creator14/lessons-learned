'use client'

import { useState } from 'react'
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories'

interface CategoryFormProps {
  category?: { id: string; name: string }
  onSuccess?: () => void
  onCancel?: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '')
  const [error, setError] = useState('')
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Category name is required')
      return
    }

    try {
      if (category) {
        const result = await updateMutation.mutateAsync({ id: category.id, name: name.trim() })
        if (result.success) {
          setName('')
          onSuccess?.()
        } else {
          setError(result.error || 'Failed to update category')
        }
      } else {
        const result = await createMutation.mutateAsync({ name: name.trim() })
        if (result.success) {
          setName('')
          onSuccess?.()
        } else {
          setError(result.error || 'Failed to create category')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          type="text"
          id="category-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          placeholder="e.g., Work, Personal, Technical"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  )
}

