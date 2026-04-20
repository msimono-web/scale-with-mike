'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { DashboardSettingsProvider } from '@/lib/dashboard-settings'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardSettingsProvider>
      <div className="min-h-screen">
        <Sidebar />
        <Header />

        {/* Content Area */}
        <main className="md:ml-[220px] pt-14 min-h-screen bg-slate-50 pb-8">
          <div className="p-3 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </DashboardSettingsProvider>
  )
}
