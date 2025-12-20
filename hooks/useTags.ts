'use client'

import { useQuery } from '@tanstack/react-query'
import { getTags } from '@/app/actions/tags'

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const result = await getTags()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tags')
      }
      return result.data
    },
  })
}

