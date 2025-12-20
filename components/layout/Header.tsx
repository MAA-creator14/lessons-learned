'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { BookOpen, Plus, LogOut, User } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/auth/login')
    router.refresh()
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Lessons</span>
            </Link>
          </div>

          {session ? (
            <div className="flex items-center space-x-4">
              {/* Navigation Pills */}
              <nav className="flex items-center space-x-2 rounded-full bg-gray-100 p-1">
                <Link
                  href="/categories"
                  className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors text-center min-w-[100px] ${
                    isActive('/categories')
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Categories
                </Link>
              </nav>

              {/* New Lesson Button - Stands Out */}
              <Link
                href="/lessons/new"
                className="flex items-center justify-center rounded-full bg-blue-600 px-5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors min-w-[100px]"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>New</span>
              </Link>

              {/* User Menu */}
              <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

