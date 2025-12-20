'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  createLessonSchema,
  updateLessonSchema,
  deleteLessonSchema,
  getLessonsSchema,
  type CreateLessonInput,
  type UpdateLessonInput,
  type GetLessonsInput,
} from '@/lib/validations/lesson'
import { UnauthorizedError, NotFoundError, ForbiddenError, ValidationError } from '@/lib/errors'
import { revalidatePath } from 'next/cache'

async function getCurrentUserId() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new UnauthorizedError('You must be logged in to perform this action')
  }
  return session.user.id
}

export async function createLesson(input: CreateLessonInput) {
  try {
    const userId = await getCurrentUserId()
    const validatedData = createLessonSchema.parse(input)

    const lesson = await prisma.lesson.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        context: validatedData.context,
        date: validatedData.date || new Date(),
        userId,
        categoryId: validatedData.categoryId || null,
        tags: validatedData.tagIds
          ? {
              connect: validatedData.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    revalidatePath('/')
    revalidatePath('/lessons')
    return { success: true, data: lesson }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, details: error.details }
    }
    console.error('Error creating lesson:', error)
    return { success: false, error: 'Failed to create lesson' }
  }
}

export async function updateLesson(input: UpdateLessonInput) {
  try {
    const userId = await getCurrentUserId()
    const validatedData = updateLessonSchema.parse(input)

    // Check if lesson exists and belongs to user
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: validatedData.id },
    })

    if (!existingLesson) {
      throw new NotFoundError('Lesson')
    }

    if (existingLesson.userId !== userId) {
      throw new ForbiddenError('You do not have permission to edit this lesson')
    }

    const lesson = await prisma.lesson.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.content && { content: validatedData.content }),
        ...(validatedData.context !== undefined && { context: validatedData.context }),
        ...(validatedData.date && { date: validatedData.date }),
        ...(validatedData.categoryId !== undefined && {
          categoryId: validatedData.categoryId || null,
        }),
        ...(validatedData.tagIds && {
          tags: {
            set: validatedData.tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        category: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    revalidatePath('/')
    revalidatePath(`/lessons/${lesson.id}`)
    revalidatePath(`/lessons/${lesson.id}/edit`)
    return { success: true, data: lesson }
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message }
    }
    console.error('Error updating lesson:', error)
    return { success: false, error: 'Failed to update lesson' }
  }
}

export async function deleteLesson(id: string) {
  try {
    const userId = await getCurrentUserId()
    const validatedData = deleteLessonSchema.parse({ id })

    // Check if lesson exists and belongs to user
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: validatedData.id },
    })

    if (!existingLesson) {
      throw new NotFoundError('Lesson')
    }

    if (existingLesson.userId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this lesson')
    }

    await prisma.lesson.delete({
      where: { id: validatedData.id },
    })

    revalidatePath('/')
    revalidatePath('/lessons')
    return { success: true }
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof ForbiddenError) {
      return { success: false, error: error.message }
    }
    console.error('Error deleting lesson:', error)
    return { success: false, error: 'Failed to delete lesson' }
  }
}

export async function getLessons(input: GetLessonsInput = { sortBy: 'createdAt', sortOrder: 'desc' }) {
  try {
    const userId = await getCurrentUserId()
    const validatedInput = getLessonsSchema.parse(input)

    const where: any = {
      userId,
    }

    // Search filter
    if (validatedInput.search) {
      where.OR = [
        { title: { contains: validatedInput.search, mode: 'insensitive' } },
        { content: { contains: validatedInput.search, mode: 'insensitive' } },
        { context: { contains: validatedInput.search, mode: 'insensitive' } },
      ]
    }

    // Category filter
    if (validatedInput.categoryId) {
      where.categoryId = validatedInput.categoryId
    }

    // Tag filter
    if (validatedInput.tagIds && validatedInput.tagIds.length > 0) {
      where.tags = {
        some: {
          id: {
            in: validatedInput.tagIds,
          },
        },
      }
    }

    const orderBy: any = {}
    orderBy[validatedInput.sortBy || 'createdAt'] = validatedInput.sortOrder || 'desc'

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        category: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy,
    })

    return { success: true, data: lessons }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { success: false, error: error.message }
    }
    console.error('Error fetching lessons:', error)
    return { success: false, error: 'Failed to fetch lessons', data: [] }
  }
}

export async function getLessonById(id: string) {
  try {
    const userId = await getCurrentUserId()

    const lesson = await prisma.lesson.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!lesson) {
      return { success: false, error: 'Lesson not found', data: null }
    }

    return { success: true, data: lesson }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return { success: false, error: error.message, data: null }
    }
    console.error('Error fetching lesson:', error)
    return { success: false, error: 'Failed to fetch lesson', data: null }
  }
}

