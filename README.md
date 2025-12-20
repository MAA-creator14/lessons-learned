# Lessons Learned

A full-stack web application for tracking and managing your lessons learned, built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure your database**:
   - Copy `.env.example` to `.env` (if it doesn't exist)
   - Update `DATABASE_URL` in `.env` with your PostgreSQL connection string
   
   For local PostgreSQL:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lessons_learned?schema=public"
   ```
   
   For cloud providers (Neon, Supabase, Railway):
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

4. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```
   
   Or if you prefer to push the schema without migrations:
   ```bash
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (dev)
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Database Schema

The application includes the following models:

- **Lesson**: Main entity for storing lessons learned
- **Category**: Organize lessons by category
- **Tag**: Tag lessons for better organization

## Project Structure

```
lessons-learned/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── lib/                   # Utility functions
│   ├── prisma.ts          # Prisma client singleton
│   └── react-query-provider.tsx  # React Query setup
├── prisma/                # Prisma configuration
│   └── schema.prisma      # Database schema
└── public/                # Static assets
```

## Next Steps

1. Create API routes in `app/api/` for CRUD operations
2. Build UI components for displaying and managing lessons
3. Add authentication if needed
4. Implement search and filtering functionality

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
