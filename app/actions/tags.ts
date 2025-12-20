'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
})

export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return { success: true, data: tags }
  } catch (error) {
    console.error('Error fetching tags:', error)
    return { success: false, error: 'Failed to fetch tags', data: [] }
  }
}

export async function createTag(input: z.infer<typeof createTagSchema>) {
  try {
    const validatedData = createTagSchema.parse(input)

    // Create slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        slug,
      },
    })

    return { success: true, data: tag }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Validation error' }
    }
    console.error('Error creating tag:', error)
    return { success: false, error: 'Failed to create tag' }
  }
}

