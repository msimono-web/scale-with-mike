'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ClientSpace } from './types'

/* ── Types ─────────────────────────────────────────────── */

export interface TeamMember {
  id: string
  email: string
  role: 'admin' | 'agent'
  status: 'active' | 'pending'
  invitedAt: string
}

export interface DashboardSettings {
  hiddenTabs: string[]          // hrefs of hidden sidebar items
  teamMembers: TeamMember[]
  whatsappMessage: string
  scoringPrompt: string
  companyName: string
  notificationsEmail: boolean
  notificationsWhatsapp: boolean
  clientSpaces: ClientSpace[]   // Espaces white-label clients
}

const DEFAULT_SETTINGS: DashboardSettings = {
  hiddenTabs: [],
  teamMembers: [
    { id: '1', email: 'm.simono@groupe-fc.com', role: 'admin', status: 'active', invitedAt: '2025-01-01' },
    { id: '2', email: 'y.brami@groupe-fc.com', role: 'admin', status: 'active', invitedAt: '2025-01-01' },
  ],
  whatsappMessage: 'Bonjour {prénom}, je suis ton Advisor ScaleWithMike. On se retrouve bientôt pour ton appel de découverte ! 🤝',
  scoringPrompt: "Évaluer la qualité du lead basé sur: secteur d'activité, potentiel de fermeture, fit avec nos services...",
  companyName: 'ScaleWithMike',
  notificationsEmail: true,
  notificationsWhatsapp: true,
  clientSpaces: [],
}

/* ── Context ───────────────────────────────────────────── */

interface SettingsContextValue {
  settings: DashboardSettings
  updateSettings: (patch: Partial<DashboardSettings>) => void
  toggleTab: (href: string) => void
  isTabHidden: (href: string) => boolean
  addTeamMember: (email: string, role: 'admin' | 'agent') => void
  removeTeamMember: (id: string) => void
  updateTeamMemberRole: (id: string, role: 'admin' | 'agent') => void
  // Client spaces (White Label)
  addClientSpace: (space: Omit<ClientSpace, 'id' | 'createdAt'>) => void
  updateClientSpace: (id: string, patch: Partial<ClientSpace>) => void
  removeClientSpace: (id: string) => void
  getClientBySlug: (slug: string) => ClientSpace | undefined
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be inside DashboardSettingsProvider')
  return ctx
}

/* ── Provider ──────────────────────────────────────────── */

const STORAGE_KEY = 'swm-dashboard-settings'

export function DashboardSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage + fetch client spaces from Supabase
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<DashboardSettings>
        setSettings(prev => ({ ...prev, ...saved }))
      }
    } catch {}
    // Fetch client spaces from Supabase, sync local → Supabase if needed
    const localSpaces: ClientSpace[] = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        return JSON.parse(raw).clientSpaces ?? []
      } catch { return [] }
    })()

    fetch('/api/client-spaces')
      .then(r => r.ok ? r.json() : [])
      .then((spaces: Array<Record<string, unknown>>) => {
        if (Array.isArray(spaces) && spaces.length > 0) {
          const mapped = spaces.map((s): ClientSpace => ({
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
          }))
          setSettings(prev => ({ ...prev, clientSpaces: mapped }))
        } else if (localSpaces.length > 0) {
          // Supabase is empty but localStorage has spaces → sync them up
          localSpaces.forEach((space: ClientSpace) => {
            fetch('/api/client-spaces', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(space),
            }).catch(() => {})
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings, loaded])

  const updateSettings = (patch: Partial<DashboardSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }))
  }

  const toggleTab = (href: string) => {
    setSettings(prev => {
      const hidden = prev.hiddenTabs.includes(href)
        ? prev.hiddenTabs.filter(h => h !== href)
        : [...prev.hiddenTabs, href]
      return { ...prev, hiddenTabs: hidden }
    })
  }

  const isTabHidden = (href: string) => settings.hiddenTabs.includes(href)

  const addTeamMember = (email: string, role: 'admin' | 'agent') => {
    setSettings(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          id: `member-${Date.now()}`,
          email,
          role,
          status: 'pending',
          invitedAt: new Date().toISOString().split('T')[0],
        },
      ],
    }))
  }

  const removeTeamMember = (id: string) => {
    setSettings(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(m => m.id !== id),
    }))
  }

  const updateTeamMemberRole = (id: string, role: 'admin' | 'agent') => {
    setSettings(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(m => m.id === id ? { ...m, role } : m),
    }))
  }

  const addClientSpace = (space: Omit<ClientSpace, 'id' | 'createdAt'>) => {
    const newSpace = { ...space, id: `cs-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }
    setSettings(prev => ({
      ...prev,
      clientSpaces: [...prev.clientSpaces, newSpace],
    }))
    // Persist to Supabase
    fetch('/api/client-spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpace),
    }).catch(() => {})
    // Sync auth data
    fetch('/api/client-space-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: newSpace.slug,
        password: space.passwordHash ? undefined : undefined,
        allowedEmails: space.allowedEmails,
        customDomain: space.customDomain,
      }),
    }).catch(() => {})
  }

  const updateClientSpace = (id: string, patch: Partial<ClientSpace>) => {
    let updatedSpace: ClientSpace | undefined
    setSettings(prev => {
      const updated = prev.clientSpaces.map(cs => {
        if (cs.id === id) { updatedSpace = { ...cs, ...patch }; return updatedSpace }
        return cs
      })
      return { ...prev, clientSpaces: updated }
    })
    // Persist to Supabase
    setTimeout(() => {
      if (updatedSpace) {
        fetch('/api/client-spaces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSpace),
        }).catch(() => {})
      }
    }, 100)
  }

  const removeClientSpace = (id: string) => {
    setSettings(prev => ({
      ...prev,
      clientSpaces: prev.clientSpaces.filter(cs => cs.id !== id),
    }))
    // Delete from Supabase
    fetch('/api/client-spaces', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
  }

  const getClientBySlug = (slug: string) =>
    settings.clientSpaces.find(cs => cs.slug === slug)

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      toggleTab,
      isTabHidden,
      addTeamMember,
      removeTeamMember,
      updateTeamMemberRole,
      addClientSpace,
      updateClientSpace,
      removeClientSpace,
      getClientBySlug,
    }}>
      {children}
    </SettingsContext.Provider>
  )
}
