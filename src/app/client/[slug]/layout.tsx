'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { DashboardSettingsProvider } from '@/lib/dashboard-settings'
import { ClientSpaceProvider } from '@/lib/client-context'
import type { ClientSpace } from '@/lib/types'

function getClientSpaces(): ClientSpace[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('swm-dashboard-settings')
    if (!raw) return []
    return JSON.parse(raw).clientSpaces ?? []
  } catch { return [] }
}

export default function ClientLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const [client, setClient] = useState<ClientSpace | null>(null)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    params.then(p => {
      setSlug(p.slug)
      const spaces = getClientSpaces()
      const found = spaces.find(cs => cs.slug === p.slug) ?? null
      setClient(found)
    })
  }, [params])

  return (
    <DashboardSettingsProvider>
      <ClientSpaceProvider client={client}>
        {/* Inject CSS vars for client theme */}
        {client && slug && (
          <style>{`
            :root {
              --client-primary: ${client.primaryColor};
              --client-secondary: ${client.secondaryColor};
            }
          `}</style>
        )}
        {children}
      </ClientSpaceProvider>
    </DashboardSettingsProvider>
  )
}
