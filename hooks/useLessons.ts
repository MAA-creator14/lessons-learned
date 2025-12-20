'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLessons, createLesson, updateLesson, deleteLesson, getLessonById } from '@/app/actions/lessons'
import type { GetLessonsInput, CreateLessonInput, UpdateLessonInput } from '@/lib/validations/lesson'

export function useLessons(filters?: GetLessonsInput) {
  return useQuery({
    queryKey: ['lessons', filters],
    queryFn: async () => {
      const result = await getLessons(filters)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch lessons')
      }
      return result.data
    },
  })
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const result = await getLessonById(id)
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch lesson')
      }
      return result.data
    },
    enabled: !!id,
  })
}

export function useCreateLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateLessonInput) => createLesson(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })
}

export function useUpdateLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateLessonInput) => updateLesson(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.id] })
    },
  })
}

export function useDeleteLesson() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })
}

