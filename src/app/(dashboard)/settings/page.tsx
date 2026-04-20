'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users, Eye, EyeOff, Mail, Shield, Bell, MessageSquare, Brain,
  UserPlus, Trash2, ChevronRight, CheckCircle2, Clock, Crown,
  TrendingUp, Zap, Calendar, FileText, CreditCard, BarChart3,
  Trophy, CheckSquare2, Save, Globe, Plus, ExternalLink, Pencil, X,
  Palette, Building2, AlignLeft, Link as LinkIcon, Image as ImageIcon, Lock,
} from 'lucide-react'
import { useSettings } from '@/lib/dashboard-settings'
import type { ClientSpace } from '@/lib/types'

/* ── Tab config for visibility toggles ─────────────────── */
const ALL_TABS = [
  { href: '/pipeline', label: 'Pipeline CRM', icon: <TrendingUp className="w-4 h-4" /> },
  { href: '/leads', label: 'Leads', icon: <Users className="w-4 h-4" /> },
  { href: '/tasks', label: 'Mes Tâches', icon: <CheckSquare2 className="w-4 h-4" /> },
  { href: '/leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
  { href: '/appointments', label: 'Rendez-vous', icon: <Calendar className="w-4 h-4" /> },
  { href: '/acquisition', label: 'Acquisition', icon: <Zap className="w-4 h-4" /> },
  { href: '/articles', label: 'Articles SEO', icon: <FileText className="w-4 h-4" /> },
  { href: '/communication', label: 'Communication', icon: <MessageSquare className="w-4 h-4" /> },
  { href: '/invoices', label: 'Facturation', icon: <CreditCard className="w-4 h-4" /> },
  { href: '/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

/* ── Settings sections ─────────────────────────────────── */
type Section = 'equipe' | 'onglets' | 'notifications' | 'whatsapp' | 'scoring' | 'api' | 'whitelabel'

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'equipe', label: 'Équipe & Invitations', icon: <Users className="w-4 h-4" /> },
  { id: 'onglets', label: 'Onglets visibles', icon: <Eye className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'scoring', label: 'Scoring IA', icon: <Brain className="w-4 h-4" /> },
  { id: 'api', label: 'Clés API', icon: <Shield className="w-4 h-4" /> },
  { id: 'whitelabel', label: 'Espaces Clients', icon: <Globe className="w-4 h-4" /> },
]

/* ── White Label helpers ───────────────────────────────── */
const EMPTY_SPACE: Omit<ClientSpace, 'id' | 'createdAt'> = {
  slug: '',
  companyName: '',
  activity: '',
  description: '',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  logoUrl: '',
  heroTitle: '',
  heroSubtitle: '',
  ctaText: 'Obtenir mon diagnostic gratuit',
  calendlyUrl: '',
  passwordHash: '',
  allowedEmails: '',
  customDomain: '',
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function SettingsPage() {
  const {
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
  } = useSettings()

  const [activeSection, setActiveSection] = useState<Section>('equipe')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'agent'>('agent')
  const [saved, setSaved] = useState(false)

  // White Label state
  const [wlMode, setWlMode] = useState<'list' | 'create' | 'edit'>('list')
  const [wlForm, setWlForm] = useState<Omit<ClientSpace, 'id' | 'createdAt'>>(EMPTY_SPACE)
  const [wlEditId, setWlEditId] = useState<string | null>(null)
  const [wlErrors, setWlErrors] = useState<Record<string, string>>({})
  const [wlPlainPassword, setWlPlainPassword] = useState('')
  const [showWlPwd, setShowWlPwd] = useState(false)
  const [domainLoading, setDomainLoading] = useState<string | null>(null)
  const [domainMsg, setDomainMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null)

  const wlSet = (key: keyof typeof wlForm, val: string) => {
    setWlForm(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'companyName' && !wlEditId) next.slug = slugify(val)
      return next
    })
    setWlErrors(prev => ({ ...prev, [key]: '' }))
  }

  const wlValidate = () => {
    const e: Record<string, string> = {}
    if (!wlForm.companyName.trim()) e.companyName = 'Nom requis'
    if (!wlForm.slug.trim()) e.slug = 'Slug requis'
    if (!wlForm.activity.trim()) e.activity = 'Activité requise'
    if (wlForm.description.trim().length < 150) e.description = `Minimum 150 caractères (${wlForm.description.trim().length}/150)`
    if (!wlForm.heroTitle.trim()) e.heroTitle = 'Titre héro requis'
    if (!wlForm.heroSubtitle.trim()) e.heroSubtitle = 'Sous-titre requis'
    setWlErrors(e)
    return Object.keys(e).length === 0
  }

  const wlSave = async () => {
    if (!wlValidate()) return

    // Sync vers Supabase (auth)
    await fetch('/api/client-space-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: wlForm.slug,
        password: wlPlainPassword || undefined,
        allowedEmails: wlForm.allowedEmails ?? '',
        customDomain: wlForm.customDomain ?? '',
      }),
    })

    if (wlEditId) {
      updateClientSpace(wlEditId, wlForm)
    } else {
      addClientSpace(wlForm)
    }
    setWlMode('list')
    setWlForm(EMPTY_SPACE)
    setWlPlainPassword('')
    setWlEditId(null)
  }

  const wlDelete = async (cs: ClientSpace) => {
    await fetch('/api/client-space-sync', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: cs.slug }),
    })
    removeClientSpace(cs.id)
  }

  const handleAddDomain = async (cs: ClientSpace) => {
    if (!cs.customDomain) return
    setDomainLoading(cs.id)
    setDomainMsg(null)
    try {
      const res = await fetch('/api/vercel-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: cs.customDomain }),
      })
      const data = await res.json()
      if (res.ok) {
        setDomainMsg({ id: cs.id, text: 'Domaine ajouté à Vercel ! Configurez maintenant votre DNS.', ok: true })
        // Sync custom domain to Supabase
        await fetch('/api/client-space-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: cs.slug, customDomain: cs.customDomain }),
        })
      } else {
        setDomainMsg({ id: cs.id, text: data.error ?? 'Erreur Vercel', ok: false })
      }
    } catch {
      setDomainMsg({ id: cs.id, text: 'Erreur réseau', ok: false })
    } finally {
      setDomainLoading(null)
    }
  }

  const wlEdit = (cs: ClientSpace) => {
    setWlForm({
      slug: cs.slug, companyName: cs.companyName, activity: cs.activity, description: cs.description,
      primaryColor: cs.primaryColor, secondaryColor: cs.secondaryColor, logoUrl: cs.logoUrl,
      heroTitle: cs.heroTitle, heroSubtitle: cs.heroSubtitle, ctaText: cs.ctaText, calendlyUrl: cs.calendlyUrl,
      passwordHash: cs.passwordHash ?? '', allowedEmails: cs.allowedEmails ?? '', customDomain: cs.customDomain ?? '',
    })
    setWlPlainPassword('')
    setWlEditId(cs.id)
    setWlMode('edit')
  }

  const wlHandleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => wlSet('logoUrl', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleInvite = () => {
    if (!inviteEmail.includes('@')) return
    addTeamMember(inviteEmail, inviteRole)
    setInviteEmail('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold">Réglages</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">Gérez votre équipe, vos onglets et vos paramètres</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 flex-shrink-0">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span className="hidden sm:inline">{saved ? 'Enregistré !' : 'Enregistrer'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Section nav — horizontal scroll on mobile, vertical on desktop */}
        <div className="md:col-span-1">
          {/* Mobile: horizontal scrollable tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeSection === s.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 bg-white border border-slate-200'
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          {/* Desktop: vertical sidebar */}
          <div className="hidden md:block space-y-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeSection === s.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform ${activeSection === s.id ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-4">

          {/* ── ÉQUIPE & INVITATIONS ─────────────────── */}
          {activeSection === 'equipe' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Inviter un membre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Email du membre"
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="flex-1"
                      onKeyDown={e => e.key === 'Enter' && handleInvite()}
                    />
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value as 'admin' | 'agent')}
                      className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white text-slate-700"
                    >
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button onClick={handleInvite} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                      <Mail className="w-4 h-4" /> Inviter
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    L&apos;invitation sera envoyée par email. Le membre devra créer son mot de passe.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Membres de l&apos;équipe ({settings.teamMembers.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {settings.teamMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            member.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {member.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{member.email}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {member.status === 'active' ? (
                                <Badge variant="secondary" className="text-[10px] gap-1 bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle2 className="w-3 h-3" /> Actif
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px] gap-1 bg-amber-50 text-amber-700 border-amber-200">
                                  <Clock className="w-3 h-3" /> Invitation envoyée
                                </Badge>
                              )}
                              <span className="text-[10px] text-slate-400">Depuis le {member.invitedAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role}
                            onChange={e => updateTeamMemberRole(member.id, e.target.value as 'admin' | 'agent')}
                            className="h-8 px-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-600"
                          >
                            <option value="admin">Admin</option>
                            <option value="agent">Agent</option>
                          </select>
                          {member.email !== 'm.simono@groupe-fc.com' && (
                            <button
                              onClick={() => removeTeamMember(member.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Retirer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── ONGLETS VISIBLES ─────────────────────── */}
          {activeSection === 'onglets' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Choisir les onglets visibles
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Masquez les onglets dont vous n&apos;avez pas besoin. Dashboard et Réglages sont toujours visibles.
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {ALL_TABS.map(tab => {
                    const hidden = isTabHidden(tab.href)
                    return (
                      <button
                        key={tab.href}
                        onClick={() => toggleTab(tab.href)}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className={hidden ? 'text-slate-300' : 'text-slate-600'}>{tab.icon}</span>
                          <span className={`text-sm font-medium ${hidden ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {tab.label}
                          </span>
                        </div>
                        <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                          hidden ? 'bg-slate-200' : 'bg-blue-600'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                            hidden ? 'translate-x-0' : 'translate-x-4'
                          }`} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── NOTIFICATIONS ────────────────────────── */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Préférences de notification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Notifications par email</p>
                    <p className="text-xs text-slate-500 mt-0.5">Recevoir un email à chaque nouveau lead</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ notificationsEmail: !settings.notificationsEmail })}
                    className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                      settings.notificationsEmail ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      settings.notificationsEmail ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Notifications WhatsApp</p>
                    <p className="text-xs text-slate-500 mt-0.5">Recevoir un WhatsApp pour les RDV et leads chauds</p>
                  </div>
                  <button
                    onClick={() => updateSettings({ notificationsWhatsapp: !settings.notificationsWhatsapp })}
                    className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                      settings.notificationsWhatsapp ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      settings.notificationsWhatsapp ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── WHATSAPP ─────────────────────────────── */}
          {activeSection === 'whatsapp' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message WhatsApp
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Message pré-rempli envoyé aux leads. Variables : {'{prénom}'}, {'{advisor}'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={settings.whatsappMessage}
                  onChange={e => updateSettings({ whatsappMessage: e.target.value })}
                  rows={4}
                  className="text-sm"
                />
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-800 mb-1">Aperçu :</p>
                  <p className="text-sm text-green-700">
                    {settings.whatsappMessage
                      .replace('{prénom}', 'Jean')
                      .replace('{advisor}', 'Mickaël')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── SCORING IA ───────────────────────────── */}
          {activeSection === 'scoring' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Configuration du Scoring IA
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Le prompt utilisé pour évaluer automatiquement la qualité des leads
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={settings.scoringPrompt}
                  onChange={e => updateSettings({ scoringPrompt: e.target.value })}
                  rows={6}
                  className="text-sm font-mono"
                />
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Variables disponibles :</p>
                  <p className="text-xs text-blue-700">
                    {'{entreprise}'}, {'{secteur}'}, {'{score_source}'}, {'{qualite_contact}'}, {'{potentiel_ca}'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── ESPACES CLIENTS (WHITE LABEL) ────────── */}
          {activeSection === 'whitelabel' && (
            <>
              {/* Header liste */}
              {wlMode === 'list' && (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Espaces Clients White Label
                          </CardTitle>
                          <p className="text-xs text-slate-500 mt-1">
                            Dupliquez votre dashboard et landing page pour d&apos;autres entreprises avec leur propre branding.
                          </p>
                        </div>
                        <Button onClick={() => { setWlForm(EMPTY_SPACE); setWlEditId(null); setWlMode('create') }}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs">
                          <Plus className="w-3.5 h-3.5" /> Nouvel espace
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  {settings.clientSpaces.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center bg-slate-50">
                      <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-500">Aucun espace client créé</p>
                      <p className="text-xs text-slate-400 mt-1">Créez un espace pour générer une LP + dashboard brandés pour un client.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {settings.clientSpaces.map(cs => (
                        <Card key={cs.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Logo ou initiale */}
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                                style={{ backgroundColor: cs.primaryColor + '20', border: `2px solid ${cs.primaryColor}40` }}>
                                {cs.logoUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={cs.logoUrl} alt={cs.companyName} className="w-full h-full object-contain p-1" />
                                ) : (
                                  <span className="text-lg font-black" style={{ color: cs.primaryColor }}>
                                    {cs.companyName[0]?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              {/* Infos */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-bold text-slate-900">{cs.companyName}</p>
                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{cs.activity}</span>
                                  <div className="flex gap-1">
                                    <span className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: cs.primaryColor }} title="Couleur principale" />
                                    <span className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ backgroundColor: cs.secondaryColor }} title="Couleur secondaire" />
                                  </div>
                                </div>
                                <div className="flex gap-3 mt-1 flex-wrap items-center">
                                  <a href={`/client/${cs.slug}`} target="_blank" rel="noreferrer"
                                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" /> LP
                                  </a>
                                  <a href={`/client/${cs.slug}/dashboard`} target="_blank" rel="noreferrer"
                                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" /> Dashboard
                                  </a>
                                  {cs.customDomain && (
                                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                      🌐 {cs.customDomain}
                                    </span>
                                  )}
                                  <span className="text-[11px] text-slate-400">Créé le {cs.createdAt}</span>
                                </div>
                                {/* Domaine custom : bouton connexion */}
                                {cs.customDomain && (
                                  <div className="mt-2">
                                    <button
                                      onClick={() => handleAddDomain(cs)}
                                      disabled={domainLoading === cs.id}
                                      className="text-[11px] px-3 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 disabled:opacity-50">
                                      {domainLoading === cs.id ? (
                                        <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <LinkIcon className="w-3 h-3" />
                                      )}
                                      Connecter le domaine à Vercel
                                    </button>
                                    {domainMsg?.id === cs.id && (
                                      <p className={`text-[11px] mt-1 ${domainMsg.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {domainMsg.text}
                                      </p>
                                    )}
                                    {domainMsg?.id === cs.id && domainMsg.ok && (
                                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-800">
                                        <p className="font-bold mb-1">📋 Instructions DNS pour {cs.customDomain} :</p>
                                        <p>Ajoutez ce CNAME chez votre registrar :</p>
                                        <code className="block bg-white border border-amber-200 rounded px-2 py-1 mt-1 font-mono">
                                          {cs.customDomain} → cname.vercel-dns.com
                                        </code>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {/* Actions */}
                              <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => wlEdit(cs)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Modifier">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => wlDelete(cs)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Supprimer">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Formulaire création / édition */}
              {(wlMode === 'create' || wlMode === 'edit') && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {wlMode === 'edit' ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          {wlMode === 'edit' ? 'Modifier l\'espace' : 'Nouvel espace client'}
                        </CardTitle>
                        <button onClick={() => { setWlMode('list'); setWlErrors({}) }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Section 1: Identité */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" /> Identité de l&apos;entreprise
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Nom de l&apos;entreprise *</Label>
                          <Input value={wlForm.companyName} onChange={e => wlSet('companyName', e.target.value)}
                            placeholder="Ex: TechCorp France" className={`mt-1 ${wlErrors.companyName ? 'border-red-400' : ''}`} />
                          {wlErrors.companyName && <p className="text-xs text-red-500 mt-1">{wlErrors.companyName}</p>}
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Slug URL *</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">/client/</span>
                            <Input value={wlForm.slug} onChange={e => wlSet('slug', slugify(e.target.value))}
                              placeholder="techcorp-france"
                              className={`pl-16 ${wlErrors.slug ? 'border-red-400' : ''}`} />
                          </div>
                          {wlErrors.slug && <p className="text-xs text-red-500 mt-1">{wlErrors.slug}</p>}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Secteur / Activité *</Label>
                        <Input value={wlForm.activity} onChange={e => wlSet('activity', e.target.value)}
                          placeholder="Ex: BTP, Immobilier, Coaching, E-commerce…"
                          className={`mt-1 ${wlErrors.activity ? 'border-red-400' : ''}`} />
                        {wlErrors.activity && <p className="text-xs text-red-500 mt-1">{wlErrors.activity}</p>}
                      </div>
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <AlignLeft className="w-3.5 h-3.5" /> Description
                          <span className={`text-xs ml-auto ${wlForm.description.length < 150 ? 'text-orange-500' : 'text-emerald-600'}`}>
                            {wlForm.description.length}/150 min
                          </span>
                        </Label>
                        <Textarea value={wlForm.description} onChange={e => wlSet('description', e.target.value)}
                          rows={4} placeholder="Décrivez l'entreprise, ses services, sa valeur ajoutée… (150 caractères minimum)"
                          className={`mt-1 text-sm ${wlErrors.description ? 'border-red-400' : ''}`} />
                        {wlErrors.description && <p className="text-xs text-red-500 mt-1">{wlErrors.description}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 2: Visuel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5" /> Identité visuelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Logo upload */}
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5" /> Logo
                        </Label>
                        <div className="mt-2 flex items-center gap-4">
                          {wlForm.logoUrl ? (
                            <div className="relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={wlForm.logoUrl} alt="Logo" className="w-16 h-16 rounded-xl object-contain border border-slate-200 bg-slate-50 p-1" />
                              <button onClick={() => wlSet('logoUrl', '')}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                              <input type="file" accept="image/*" className="hidden" onChange={wlHandleLogo} />
                            </label>
                          )}
                          <div className="text-xs text-slate-500">
                            <p className="font-medium">Uploader un logo</p>
                            <p>PNG, JPG, SVG — max 2 Mo</p>
                            <p>Recommandé : 200×200px</p>
                          </div>
                        </div>
                      </div>

                      {/* Couleurs */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Couleur principale</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input type="color" value={wlForm.primaryColor}
                              onChange={e => wlSet('primaryColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5" />
                            <Input value={wlForm.primaryColor} onChange={e => wlSet('primaryColor', e.target.value)}
                              placeholder="#3b82f6" className="text-sm font-mono" />
                          </div>
                          <div className="mt-2 h-8 rounded-lg transition-all" style={{ backgroundColor: wlForm.primaryColor }} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Couleur secondaire</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <input type="color" value={wlForm.secondaryColor}
                              onChange={e => wlSet('secondaryColor', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5" />
                            <Input value={wlForm.secondaryColor} onChange={e => wlSet('secondaryColor', e.target.value)}
                              placeholder="#10b981" className="text-sm font-mono" />
                          </div>
                          <div className="mt-2 h-8 rounded-lg transition-all" style={{ backgroundColor: wlForm.secondaryColor }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 3: Landing Page */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" /> Contenu Landing Page
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Titre héro *</Label>
                        <Input value={wlForm.heroTitle} onChange={e => wlSet('heroTitle', e.target.value)}
                          placeholder="Ex: Boostez vos ventes avec notre call center"
                          className={`mt-1 ${wlErrors.heroTitle ? 'border-red-400' : ''}`} />
                        {wlErrors.heroTitle && <p className="text-xs text-red-500 mt-1">{wlErrors.heroTitle}</p>}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Sous-titre héro *</Label>
                        <Textarea value={wlForm.heroSubtitle} onChange={e => wlSet('heroSubtitle', e.target.value)}
                          rows={2} placeholder="Ex: Des agents qualifiés disponibles 7j/7 pour qualifier vos prospects…"
                          className={`mt-1 text-sm ${wlErrors.heroSubtitle ? 'border-red-400' : ''}`} />
                        {wlErrors.heroSubtitle && <p className="text-xs text-red-500 mt-1">{wlErrors.heroSubtitle}</p>}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Texte du bouton CTA</Label>
                        <Input value={wlForm.ctaText} onChange={e => wlSet('ctaText', e.target.value)}
                          placeholder="Obtenir mon diagnostic gratuit" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <LinkIcon className="w-3.5 h-3.5" /> Lien Calendly du client
                        </Label>
                        <Input value={wlForm.calendlyUrl} onChange={e => wlSet('calendlyUrl', e.target.value)}
                          placeholder="https://calendly.com/…" className="mt-1" type="url" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 4: Accès privé */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Accès privé au dashboard client
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Mot de passe */}
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          Mot de passe
                          {wlEditId && <span className="text-xs text-slate-400 font-normal">(laisser vide pour ne pas changer)</span>}
                        </Label>
                        <div className="relative mt-1">
                          <input
                            type={showWlPwd ? 'text' : 'password'}
                            value={wlPlainPassword}
                            onChange={e => setWlPlainPassword(e.target.value)}
                            placeholder={wlEditId ? '••••••••' : 'Choisir un mot de passe'}
                            className="w-full pr-11 px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-400 bg-slate-50"
                          />
                          <button type="button" onClick={() => setShowWlPwd(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showWlPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Le client entre ce mot de passe sur sa page de connexion.</p>
                      </div>

                      {/* Emails Google */}
                      <div>
                        <Label className="text-sm font-medium">Emails autorisés Google</Label>
                        <Input
                          value={wlForm.allowedEmails ?? ''}
                          onChange={e => wlSet('allowedEmails', e.target.value)}
                          placeholder="contact@techcorp.fr, admin@techcorp.fr"
                          className="mt-1"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Séparés par virgule. Ces emails pourront aussi se connecter via Google.
                          Laisser vide pour désactiver la connexion Google.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section 5: Domaine custom */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" /> Nom de domaine
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                        <p className="font-semibold mb-1">🚀 Sous-domaine automatique (inclus)</p>
                        <p>Votre espace sera accessible sur :</p>
                        <code className="block bg-white border border-blue-200 rounded px-2 py-1 mt-1 font-mono text-blue-800">
                          {wlForm.slug ? `${wlForm.slug}.scale-with-mike.vercel.app` : 'slug.scale-with-mike.vercel.app'}
                        </code>
                        <p className="mt-2 text-blue-600">Dès la création, aucune config requise.</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5" /> Domaine personnalisé du client
                        </Label>
                        <Input
                          value={wlForm.customDomain ?? ''}
                          onChange={e => wlSet('customDomain', e.target.value)}
                          placeholder="crm.techcorp.fr"
                          className="mt-1"
                          type="text"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Optionnel. Après la création, un bouton &quot;Connecter à Vercel&quot; apparaîtra
                          avec les instructions DNS à envoyer au client.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                        <p className="font-semibold mb-1">Pour activer le domaine custom :</p>
                        <p>1. Ajoutez <code className="bg-white px-1 py-0.5 rounded border">VERCEL_TOKEN</code> et <code className="bg-white px-1 py-0.5 rounded border">VERCEL_PROJECT_ID</code> dans votre <code className="bg-white px-1 py-0.5 rounded border">.env.local</code></p>
                        <p className="mt-1">2. Cliquez &quot;Connecter à Vercel&quot; depuis la liste</p>
                        <p className="mt-1">3. Configurez le CNAME chez le registrar du client</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview + Save */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {wlForm.companyName || 'Nom de l\'entreprise'}
                          </p>
                          <div className="flex gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                            {wlForm.slug && <span>🌐 /client/<strong>{wlForm.slug}</strong></span>}
                            {wlForm.slug && <span>📊 /client/<strong>{wlForm.slug}</strong>/dashboard</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => { setWlMode('list'); setWlErrors({}) }} className="gap-2 text-sm">
                            Annuler
                          </Button>
                          <Button onClick={wlSave}
                            className="text-white gap-2 text-sm"
                            style={{ backgroundColor: wlForm.primaryColor || '#3b82f6' }}>
                            <Save className="w-4 h-4" />
                            {wlMode === 'edit' ? 'Mettre à jour' : 'Créer l\'espace'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}

          {/* ── CLÉS API ─────────────────────────────── */}
          {activeSection === 'api' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Clés API & Intégrations
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1">
                  Configurez vos clés pour connecter les plateformes externes
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: 'Google Analytics (ID)', placeholder: 'G-XXXXXXXXXX', key: 'ga' },
                  { label: 'Facebook Pixel', placeholder: 'Votre ID Pixel Facebook', key: 'fb' },
                  { label: 'Twitter / X API Key', placeholder: 'Votre API key Twitter', key: 'tw' },
                  { label: 'OpenAI API Key (scoring)', placeholder: 'sk-...', key: 'openai' },
                ].map(field => (
                  <div key={field.key}>
                    <Label className="text-sm font-medium">{field.label}</Label>
                    <Input type="password" placeholder={field.placeholder} className="mt-1" />
                  </div>
                ))}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs text-amber-800">
                    <strong>Note :</strong> Les clés API sont stockées localement pour le moment.
                    Une fois Supabase configuré avec le chiffrement, elles seront stockées de manière sécurisée côté serveur.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
