'use client'

import { X } from 'lucide-react'
import { CategoryForm } from './CategoryForm'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoryCreated?: (categoryId: string) => void
}

export function CreateCategoryModal({ isOpen, onClose, onCategoryCreated }: CreateCategoryModalProps) {
  if (!isOpen) return null

  const handleSuccess = () => {
    // Close modal - the parent will refresh categories list via React Query
    onClose()
    // Note: We can't easily get the category ID here without refactoring CategoryForm
    // The parent component will refresh the categories list and the user can select it
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create New Category</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <CategoryForm onSuccess={handleSuccess} onCancel={onClose} />
      </div>
    </div>
  )
}

