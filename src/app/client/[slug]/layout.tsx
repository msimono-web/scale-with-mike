'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { DashboardSettingsProvider } from '@/lib/dashboard-settings'
import { ClientSpaceProvider } from '@/lib/client-context'
import type { ClientSpace } from '@/lib/types'

async function fetchClientBySlug(slug: string): Promise<ClientSpace | null> {
  try {
    const res = await fetch(`/api/client-spaces?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    const data = await res.json()
    const spaces = Array.isArray(data) ? data : [data]
    const s = spaces.find((x: Record<string, unknown>) => x.slug === slug)
    if (!s) return null
    return {
      id: s.id as string,
      slug: s.slug as string,
      companyName: (s.company_name || '') as string,
      activity: (s.activity || '') as string,
      description: (s.description || '') as string,
      primaryColor: (s.primary_color || '#3b82f6') as string,
      secondaryColor: (s.secondary_color || '#10b981') as string,
      logoUrl: (s.logo_url || '') as string,
      heroTitle: (s.hero_title || '') as string,
      heroSubtitle: (s.hero_subtitle || '') as string,
      ctaText: (s.cta_text || '') as string,
      calendlyUrl: (s.calendly_url || '') as string,
      createdAt: (s.created_at || '') as string,
      passwordHash: (s.password_hash || undefined) as string | undefined,
      allowedEmails: (s.allowed_emails || undefined) as string | undefined,
      customDomain: (s.custom_domain || undefined) as string | undefined,
      vercelDomainId: (s.vercel_domain_id || undefined) as string | undefined,
    }
  } catch { return null }
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
      fetchClientBySlug(p.slug).then(found => setClient(found))
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
