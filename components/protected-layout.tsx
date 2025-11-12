'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  useEffect(() => {
    if (!isPending) {
      if (!session && !isPublicRoute) {
        router.push('/login')
      } else if (session && isPublicRoute) {
        router.push('/')
      }
    }
  }, [session, isPending, router, isPublicRoute])

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-12 w-48" />
      </div>
    )
  }

  return <>{children}</>
}
