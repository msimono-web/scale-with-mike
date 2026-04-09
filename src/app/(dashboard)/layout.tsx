import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Banner Demo */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center text-xs py-1 fixed top-0 left-0 right-0 z-50">
        MODE DEMO — Données fictives pour présentation
      </div>

      <Sidebar />
      <Header />

      {/* Content Area */}
      <main className="ml-[220px] pt-[84px] min-h-screen bg-slate-50 pb-8">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
