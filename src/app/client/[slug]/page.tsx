'use client'

import { useState, useEffect } from 'react'
import { Phone, CheckCircle2, Star, ArrowRight, Users, Shield, TrendingUp, Zap, Play } from 'lucide-react'
import type { ClientSpace } from '@/lib/types'

/* ── Helpers ─────────────────────────────────────────────── */
async function fetchClientBySlug(slug: string): Promise<ClientSpace | null> {
  try {
    const res = await fetch(`/api/client-spaces?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    const data = await res.json()
    // If API returns array, find by slug; if single object, use directly
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

/* ── Composant formulaire ────────────────────────────────── */
function DiagForm({ client }: { client: ClientSpace }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')

  const handleSubmit = async () => {
    if (!prenom && !telephone) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, email, telephone, source: `Site web – ${client.companyName}` }),
      })
    } catch (e) { console.error(e) }
    finally { setLoading(false); setSent(true) }
  }

  const inputClass = `w-full rounded-xl px-4 py-3 text-sm outline-none border bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 transition-all`

  if (sent) return (
    <div className="rounded-2xl p-8 text-center bg-white border border-slate-200 shadow-xl">
      <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: client.secondaryColor }} />
      <p className="font-black text-lg text-slate-900">Demande reçue !</p>
      <p className="text-sm mt-1 text-slate-500">On vous rappelle sous 24h.</p>
    </div>
  )

  return (
    <div className="rounded-2xl p-7 shadow-2xl bg-white border border-slate-100">
      <p className="font-black text-sm uppercase tracking-widest text-center mb-1 text-slate-900">Diagnostic gratuit</p>
      <p className="text-xs text-center mb-5 text-slate-400">Sans engagement · Réponse sous 24h</p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)}
            className={inputClass} style={{ '--tw-ring-color': client.primaryColor + '40' } as React.CSSProperties} />
          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            className={inputClass} />
        </div>
        <input placeholder="Téléphone / WhatsApp" value={telephone} onChange={e => setTelephone(e.target.value)}
          className={inputClass} />
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 font-black rounded-xl text-sm tracking-widest uppercase shadow-lg hover:brightness-110 disabled:opacity-60 transition-all text-white"
          style={{ backgroundColor: client.secondaryColor }}>
          {loading ? 'Envoi…' : `${client.ctaText} →`}
        </button>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-3 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-semibold">
          <Phone className="w-4 h-4" style={{ color: client.secondaryColor }} /> Être rappelé directement
        </button>
      </div>
      <div className="flex justify-center gap-4 mt-4 text-xs text-slate-400 flex-wrap">
        {['🔒 Sécurisé', '⚡ Réponse sous 24h', '✓ Sans engagement'].map(t => <span key={t}>{t}</span>)}
      </div>
    </div>
  )
}

/* ── Page principale ─────────────────────────────────────── */
export default function ClientLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const [client, setClient] = useState<ClientSpace | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    params.then(p => {
      fetchClientBySlug(p.slug).then(found => {
        setClient(found)
        setLoaded(true)
      })
    })
  }, [params])

  if (!loaded) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
    </div>
  )

  if (!client) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-8">
      <p className="text-4xl mb-4">🔍</p>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Espace introuvable</h1>
      <p className="text-slate-500">Cet espace client n&apos;existe pas ou a été supprimé.</p>
    </div>
  )

  const STATS = [
    { label: 'Appels qualifiés / mois', value: '2 400+', icon: <Phone className="w-5 h-5" /> },
    { label: 'Taux de conversion moyen', value: '34%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Clients accompagnés', value: '180+', icon: <Users className="w-5 h-5" /> },
    { label: 'ROI moyen constaté', value: '×4.2', icon: <Zap className="w-5 h-5" /> },
  ]

  const FEATURES = [
    { icon: <Users className="w-5 h-5" />, title: 'Agents dédiés', desc: 'Une équipe formée à votre secteur et vos produits.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Conformité RGPD', desc: 'Données sécurisées, scripts validés, traçabilité complète.' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Reporting temps réel', desc: 'Dashboard live avec KPIs, taux de conversion et recordings.' },
    { icon: <Zap className="w-5 h-5" />, title: 'Activation en 48h', desc: 'Onboarding express, aucune infrastructure à gérer de votre côté.' },
  ]

  const FAQS = [
    { q: 'Combien de temps pour démarrer ?', a: 'Le onboarding prend généralement 48h. Nos agents sont formés à votre secteur avant le premier appel.' },
    { q: 'Comment fonctionne la facturation ?', a: 'Abonnement mensuel sans engagement. Facturation au volume d\'appels ou au forfait selon votre volume.' },
    { q: 'Puis-je suivre les performances en temps réel ?', a: 'Oui, vous avez accès à un dashboard CRM complet avec statistiques, enregistrements et rapports hebdomadaires.' },
    { q: 'Mes données sont-elles sécurisées ?', a: 'Absolument. Hébergement en France, conformité RGPD, et accès sécurisé uniquement à votre équipe.' },
  ]

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl text-slate-900">
            {client.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logoUrl} alt={client.companyName} className="h-9 w-auto" />
            ) : (
              <span style={{ color: client.primaryColor }}>{client.companyName}</span>
            )}
          </div>
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 shadow"
            style={{ backgroundColor: client.primaryColor }}>
            Prendre RDV
          </button>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="pt-24 pb-20 px-6" style={{
        background: `linear-gradient(135deg, ${client.primaryColor}08 0%, ${client.secondaryColor}06 100%)`
      }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Badge activité */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border"
              style={{ backgroundColor: client.primaryColor + '15', color: client.primaryColor, borderColor: client.primaryColor + '30' }}>
              <Zap className="w-3.5 h-3.5" />
              {client.activity}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              {client.heroTitle}
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">{client.heroSubtitle}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-7 py-4 rounded-xl font-black text-sm text-white shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
                style={{ backgroundColor: client.primaryColor }}>
                {client.ctaText} <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-4 rounded-xl font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" style={{ color: client.primaryColor }} /> Voir comment ça marche
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {['#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b'].map((bg, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: bg }}>
                    {['M', 'S', 'J', 'A'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">+180 entreprises accompagnées</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div>
            <DiagForm client={client} />
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: client.primaryColor + '15', color: client.primaryColor }}>
                {s.icon}
              </div>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: client.primaryColor }}>
              Pourquoi nous choisir
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              {client.description.slice(0, 200)}{client.description.length > 200 ? '…' : ''}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: client.primaryColor + '15', color: client.primaryColor }}>
                  {f.icon}
                </div>
                <p className="font-bold text-slate-900 mb-1">{f.title}</p>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALENDLY / CTA ────────────────────────────────── */}
      <section className="py-20 px-6" style={{
        background: `linear-gradient(135deg, ${client.primaryColor} 0%, ${client.secondaryColor} 100%)`
      }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Prêt à booster vos ventes ?
          </h2>
          <p className="text-white/80 mb-8">Prenez rendez-vous avec notre équipe en 2 minutes.</p>
          {client.calendlyUrl ? (
            <a href={client.calendlyUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl font-black text-sm shadow-xl hover:brightness-110 transition-all"
              style={{ color: client.primaryColor }}>
              Réserver mon créneau <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <button className="px-8 py-4 bg-white rounded-xl font-black text-sm shadow-xl hover:brightness-110 transition-all"
              style={{ color: client.primaryColor }}>
              {client.ctaText} →
            </button>
          )}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 font-semibold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <span>{faq.q}</span>
                  <span className="text-lg flex-shrink-0" style={{ color: client.primaryColor }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-black text-slate-900" style={{ color: client.primaryColor }}>
            {client.companyName}
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} {client.companyName} · Tous droits réservés
          </p>
          <p className="text-xs text-slate-400">Propulsé par ScaleWithMike</p>
        </div>
      </footer>
    </div>
  )
}
