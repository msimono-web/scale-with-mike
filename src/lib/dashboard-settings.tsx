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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<DashboardSettings>
        setSettings(prev => ({ ...prev, ...saved }))
      }
    } catch {}
    setLoaded(true)
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
    setSettings(prev => ({
      ...prev,
      clientSpaces: [
        ...prev.clientSpaces,
        { ...space, id: `cs-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] },
      ],
    }))
  }

  const updateClientSpace = (id: string, patch: Partial<ClientSpace>) => {
    setSettings(prev => ({
      ...prev,
      clientSpaces: prev.clientSpaces.map(cs => cs.id === id ? { ...cs, ...patch } : cs),
    }))
  }

  const removeClientSpace = (id: string) => {
    setSettings(prev => ({
      ...prev,
      clientSpaces: prev.clientSpaces.filter(cs => cs.id !== id),
    }))
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
