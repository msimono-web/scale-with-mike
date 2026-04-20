'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="md:ml-[220px] pt-14 min-h-screen bg-slate-50 pb-8">
        <div className="p-3 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
