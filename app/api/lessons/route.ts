import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
})

// GET /api/lessons - Fetch all lessons
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        category: true,
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

// POST /api/lessons - Create a new lesson
// NOTE: This route is deprecated. Use Server Actions in app/actions/lessons.ts instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use Server Actions.' },
    { status: 410 }
  )
}


