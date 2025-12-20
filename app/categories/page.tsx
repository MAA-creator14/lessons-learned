'use client'

import { useState } from 'react'
import { useCategories, useDeleteCategory } from '@/hooks/useCategories'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Plus, Edit, Trash2, Folder } from 'lucide-react'

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const deleteMutation = useDeleteCategory()
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      const result = await deleteMutation.mutateAsync(id)
      if (!result.success) {
        alert(result.error || 'Failed to delete category')
      }
    }
  }

  const handleEdit = (category: { id: string; name: string }) => {
    setEditingCategory(category)
    setShowCreateForm(false)
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setShowCreateForm(false)
  }

  const handleSuccess = () => {
    setEditingCategory(null)
    setShowCreateForm(false)
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="mt-2 text-gray-600">
              Organize your lessons by creating and managing categories.
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true)
              setEditingCategory(null)
            }}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Category</span>
          </button>
        </div>

        {(showCreateForm || editingCategory) && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <CategoryForm
              category={editingCategory || undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
            <Folder className="h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No categories yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first category.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Category</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">Slug: {category.slug}</p>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                      title="Edit category"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deleteMutation.isPending}
                      className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}

