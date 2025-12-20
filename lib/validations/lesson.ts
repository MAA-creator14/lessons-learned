import { z } from 'zod'

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  context: z.string().max(500, 'Context must be less than 500 characters').optional(),
  date: z.coerce.date().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
})

export const updateLessonSchema = createLessonSchema.partial().extend({
  id: z.string().min(1, 'Lesson ID is required'),
})

export const deleteLessonSchema = z.object({
  id: z.string().min(1, 'Lesson ID is required'),
})

export const getLessonsSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  sortBy: z.enum(['date', 'title', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

export type CreateLessonInput = z.infer<typeof createLessonSchema>
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>
export type DeleteLessonInput = z.infer<typeof deleteLessonSchema>
export type GetLessonsInput = z.infer<typeof getLessonsSchema>

