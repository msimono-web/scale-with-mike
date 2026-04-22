'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
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

export default function ClientLoginPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [client, setClient] = useState<ClientSpace | null>(null)
  const [slug, setSlug] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    params.then(p => {
      setSlug(p.slug)
      fetchClientBySlug(p.slug).then(found => setClient(found))
    })
  }, [params])

  const handlePasswordLogin = async () => {
    if (!password) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Identifiants incorrects'); return }
      router.push(`/client/${slug}/dashboard`)
    } catch {
      setError('Erreur réseau, réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    )
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/client/${slug}/auth/callback`,
      },
    })
  }

  const primary = client?.primaryColor ?? '#3b82f6'
  const secondary = client?.secondaryColor ?? '#10b981'

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: `linear-gradient(135deg, ${primary}10 0%, ${secondary}08 100%)` }}>

      <div className="w-full max-w-md">
        {/* Logo / nom */}
        <div className="text-center mb-8">
          {client?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={client.logoUrl} alt={client.companyName} className="h-16 w-auto mx-auto mb-4 object-contain" />
          ) : (
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black"
              style={{ backgroundColor: primary }}>
              {client?.companyName?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <h1 className="text-2xl font-black text-slate-900">
            {client ? `Espace ${client.companyName}` : 'Connexion'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Accès réservé — identifiez-vous pour continuer</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Bouton Google */}
          {(client?.allowedEmails ?? '').trim().length > 0 && (
            <>
              <button onClick={handleGoogleLogin}
                className="w-full py-3 rounded-xl font-semibold text-sm mb-4 flex items-center justify-center gap-3 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700">
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continuer avec Google
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">ou</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          {/* Mot de passe */}
          <div className="relative mb-4">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 transition-all bg-slate-50"
              style={{ '--tw-ring-color': primary + '40' } as React.CSSProperties}
            />
            <button onClick={() => setShowPwd(p => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button onClick={handlePasswordLogin} disabled={loading || !password}
            className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest text-white transition-all hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: primary }}>
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {loading ? 'Connexion…' : 'Accéder au dashboard'}
          </button>

          <p className="text-center text-xs text-slate-400 mt-5">
            Accès sécurisé · Session de 7 jours
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Propulsé par <span className="font-semibold">ScaleWithMike</span>
        </p>
      </div>
    </div>
  )
}
