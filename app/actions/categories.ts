'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
})

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return { success: true, data: categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, error: 'Failed to fetch categories', data: [] }
  }
}

export async function createCategory(input: z.infer<typeof createCategorySchema>) {
  try {
    const validatedData = createCategorySchema.parse(input)

    // Create slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
      },
    })

    revalidatePath('/categories')
    revalidatePath('/lessons/new')
    revalidatePath('/')

    return { success: true, data: category }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Validation error' }
    }
    console.error('Error creating category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

const updateCategorySchema = createCategorySchema.extend({
  id: z.string().min(1, 'Category ID is required'),
})

export async function updateCategory(input: z.infer<typeof updateCategorySchema>) {
  try {
    const validatedData = updateCategorySchema.parse(input)

    // Create slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category = await prisma.category.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        slug,
      },
    })

    revalidatePath('/categories')
    revalidatePath('/lessons/new')
    revalidatePath('/')

    return { success: true, data: category }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Validation error' }
    }
    console.error('Error updating category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category is being used by any lessons
    const lessonsCount = await prisma.lesson.count({
      where: { categoryId: id },
    })

    if (lessonsCount > 0) {
      return {
        success: false,
        error: `Cannot delete category. It is being used by ${lessonsCount} lesson(s).`,
      }
    }

    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/categories')
    revalidatePath('/lessons/new')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

