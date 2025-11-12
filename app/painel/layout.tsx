'use client'

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import UserMenu from "@/components/user-menu"
import { ProtectedLayout } from "@/components/protected-layout"

export default function PainelLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedLayout>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <SidebarTrigger />
            <UserMenu />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedLayout>
  )
}
