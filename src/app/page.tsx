'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, CheckCircle2, TrendingUp, Users, Target, BarChart3, Calendar, ArrowUpRight, Star, Play, Activity, PieChart, Zap, ArrowRight } from 'lucide-react'

// ─── COLORS ──────────────────────────────────────────────────────────────────
// Light theme: white sections, slate text, blue accents, 1 dark hero

function CtaPrimary({ label = "Réserver un appel", href = "#contact" }: { label?: string; href?: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-blue-600/25">
      <Phone className="w-4 h-4" />{label}
    </a>
  )
}
function CtaSecondary({ label = "Voir comment ça fonctionne", href = "#methode" }: { label?: string; href?: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 px-6 py-3.5 border border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-medium rounded-xl transition-all text-sm bg-white hover:bg-blue-50">
      <Play className="w-4 h-4" />{label}
    </a>
  )
}

// ─── LEAD FORM ────────────────────────────────────────────────────────────────
function LeadForm({ dark = false }: { dark?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  if (submitted) {
    return (
      <div className={`rounded-2xl p-8 text-center ${dark ? 'bg-white/10 border border-white/20' : 'bg-green-50 border border-green-200'}`}>
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className={`font-bold text-lg ${dark ? 'text-white' : 'text-slate-800'}`}>Demande envoyée !</p>
        <p className={`text-sm mt-2 ${dark ? 'text-blue-200' : 'text-slate-500'}`}>Notre équipe vous rappelle sous 24h ouvrées.</p>
      </div>
    )
  }

  const inputCls = dark
    ? "flex-1 flex items-center gap-2 bg-white/10 border border-white/20 hover:border-white/40 rounded-xl px-3 py-3 transition-colors"
    : "flex-1 flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-3 py-3 transition-colors shadow-sm"
  const textCls = dark ? "bg-transparent text-white placeholder-blue-300 text-sm outline-none w-full" : "bg-transparent text-slate-800 placeholder-slate-400 text-sm outline-none w-full"

  return (
    <div className={`rounded-2xl p-6 ${dark ? 'bg-white/10 border border-white/20 backdrop-blur-sm' : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/60'}`}>
      <p className={`text-center font-bold text-sm mb-1 tracking-wide uppercase ${dark ? 'text-white' : 'text-slate-800'}`}>Accéder au diagnostic gratuit</p>
      <p className={`text-center text-xs mb-5 ${dark ? 'text-blue-200' : 'text-slate-400'}`}>Réponse sous 24h — Sans engagement</p>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className={inputCls}>
            <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Prénom" className={textCls} />
          </div>
          <div className={inputCls}>
            <span className="text-blue-400 text-sm flex-shrink-0">@</span>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email pro" className={textCls} />
          </div>
        </div>
        <div className={inputCls}>
          <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Téléphone / WhatsApp" className={textCls} />
        </div>
        <button onClick={() => setSubmitted(true)} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-blue-600/25">
          Réserver mon appel diagnostic →
        </button>
        <button onClick={() => setSubmitted(true)} className={`w-full py-2.5 border text-sm rounded-xl flex items-center justify-center gap-2 transition-all ${dark ? 'border-white/20 text-white hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          <Phone className="w-4 h-4" /> On vous rappelle directement
        </button>
      </div>
    </div>
  )
}

// ─── MINI DASHBOARD VISUAL ────────────────────────────────────────────────────
function DashboardVisual() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.03]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-slate-500 text-xs">ScaleWithMike CRM — Dashboard</span>
      </div>
      <div className="grid grid-cols-4 gap-0 border-b border-white/5">
        {[
          { label: 'Leads traités', val: '1 240', delta: '+12%', color: 'text-blue-400' },
          { label: 'RDV pris', val: '87', delta: '+8%', color: 'text-green-400' },
          { label: 'Taux contact', val: '34%', delta: '+5%', color: 'text-cyan-400' },
          { label: 'ROI estimé', val: '3.8x', delta: '+0.4', color: 'text-yellow-400' },
        ].map(({ label, val, delta, color }) => (
          <div key={label} className="px-4 py-3 border-r border-white/5 last:border-r-0">
            <div className={`text-xl font-black ${color}`}>{val}</div>
            <div className="text-slate-500 text-xs">{label}</div>
            <div className="text-green-400 text-xs mt-0.5">{delta}</div>
          </div>
        ))}
      </div>
      <div className="p-4 flex gap-4">
        <div className="flex-1">
          <div className="text-slate-400 text-xs mb-3 font-medium">RDV par semaine</div>
          <div className="flex items-end gap-1.5 h-20">
            {[40, 65, 55, 80, 70, 90, 75, 95, 85, 100, 88, 92].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 11 ? '#3b82f6' : `rgba(59,130,246,${0.15 + i * 0.05})` }} />
            ))}
          </div>
        </div>
        <div className="w-40">
          <div className="text-slate-400 text-xs mb-3 font-medium">Top agents</div>
          <div className="space-y-2">
            {[{ name: 'Sophie L.', rdv: 23, color: 'bg-yellow-400' }, { name: 'Marc D.', rdv: 19, color: 'bg-slate-400' }, { name: 'Julie M.', rdv: 16, color: 'bg-orange-500' }].map(({ name, rdv, color }) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                <span className="text-slate-300 text-xs flex-1">{name}</span>
                <span className="text-blue-400 text-xs font-bold">{rdv} RDV</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="bg-white text-slate-800 font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight text-slate-900">
            <span className="text-yellow-500">⚡</span>
            <span>Scale</span><span className="text-blue-600">With</span><span>Mike</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#methode" className="hover:text-blue-600 transition-colors">La Méthode</a>
            <a href="#processus" className="hover:text-blue-600 transition-colors">Processus</a>
            <a href="#resultats" className="hover:text-blue-600 transition-colors">Résultats</a>
            <a href="#articles" className="hover:text-blue-600 transition-colors">Ressources</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 transition-colors hidden md:block">
              Accéder au CRM
            </Link>
            <a href="#contact" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-600/20">
              Prendre un RDV
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO (dark) ── */}
      <section className="relative min-h-screen flex items-center pt-20 bg-slate-900 overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Glow */}
        <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15), transparent)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Call Center Externalisé B2B — 100% Francophone
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-white">
                REMPLISSEZ<br />VOTRE AGENDA DE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">RDV QUALIFIÉS</span>
              </h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Une équipe de téléprospecteurs dédiée qui contacte vos leads,
                qualifie leurs besoins et remplit votre pipeline — opérationnelle en 7 jours.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Dès 800€ / agent / mois", "Opérationnel en 7 jours", "Responsable inclus", "+35% taux de conversion"].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />{item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <CtaPrimary label="Réserver un appel diagnostic" href="#contact" />
                <a href="#methode" className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all text-sm bg-white/5 hover:bg-white/10">
                  <Play className="w-4 h-4" /> Voir comment ça fonctionne
                </a>
              </div>
              <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/10">
                {[{ val: '+200', label: 'RDV / mois' }, { val: '98%', label: 'Satisfaction' }, { val: '7 jours', label: 'Démarrage' }].map(({ val, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-white">{val}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <LeadForm dark />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <div className="bg-slate-50 border-y border-slate-200 py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-8 items-center">
          <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Secteurs actifs</span>
          {["Industrie & BTP", "Services B2B", "Immobilier", "Tech / SaaS", "Formation professionnelle"].map(s => (
            <span key={s} className="text-slate-500 text-sm font-medium">{s}</span>
          ))}
        </div>
      </div>

      {/* ── PROBLÈME ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">LE PROBLÈME</div>
              <h2 className="text-4xl font-black mb-6 leading-tight text-slate-900">
                Vos commerciaux closent.<br />
                <span className="text-blue-600">Mais qui prospecte ?</span>
              </h2>
              <div className="space-y-4 text-slate-600">
                {[
                  "Vos closers perdent 60% de leur temps à rappeler des leads froids au lieu de signer",
                  "Chaque lead non contacté dans les 5 minutes perd 80% de ses chances de conversion",
                  "Recruter une équipe interne prend 3 à 6 mois et coûte 3× plus cher",
                ].map((text, i) => (
                  <p key={i} className="flex gap-3 items-start bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                    <span>{text}</span>
                  </p>
                ))}
              </div>
              <blockquote className="mt-8 pl-4 border-l-4 border-blue-600 text-slate-600 italic text-lg">
                "Le vrai frein à votre croissance, ce n'est pas votre offre. C'est votre pipeline."
              </blockquote>
            </div>
            <div className="bg-slate-50 rounded-2xl p-7 border border-slate-200">
              <div className="text-slate-500 text-xs uppercase tracking-widest mb-6 font-bold">La réalité de vos leads aujourd'hui</div>
              <div className="space-y-5">
                {[
                  { label: 'Leads jamais contactés', pct: 45, color: 'bg-red-500' },
                  { label: 'Relances insuffisantes', pct: 30, color: 'bg-orange-400' },
                  { label: 'Mal qualifiés', pct: 15, color: 'bg-yellow-400' },
                  { label: 'Traitement optimal', pct: 10, color: 'bg-green-500' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-600">{label}</span>
                      <span className="text-slate-800 font-bold">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RÉSULTATS CONCRETS ── */}
      <section id="resultats" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 border border-green-300 text-green-700 bg-green-50 text-xs font-bold tracking-widest uppercase rounded-full mb-4">PREUVES RÉELLES</div>
            <h2 className="text-4xl font-black text-slate-900">RÉSULTATS <span className="text-green-600">CONCRETS</span></h2>
            <p className="text-slate-500 mt-3">Exemples de performances réelles sur 90 jours</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { sector: "Services B2B / Conseil", badge: "🏆 Meilleur ROI", badgeColor: "bg-yellow-50 text-yellow-700 border-yellow-200", stats: [{ label: "Leads injectés", val: "520" }, { label: "RDV obtenus", val: "94" }, { label: "Contrats signés", val: "17" }, { label: "CA généré", val: "68 000€" }], team: "6 agents — 3 mois", accent: "border-t-yellow-400" },
              { sector: "Industrie / Équipement", badge: "⚡ Scale rapide", badgeColor: "bg-blue-50 text-blue-700 border-blue-200", stats: [{ label: "Leads injectés", val: "380" }, { label: "RDV obtenus", val: "61" }, { label: "Contrats signés", val: "11" }, { label: "CA généré", val: "44 000€" }], team: "5 agents — 3 mois", accent: "border-t-blue-500" },
              { sector: "Formation Pro / Coaching", badge: "📈 Croissance", badgeColor: "bg-purple-50 text-purple-700 border-purple-200", stats: [{ label: "Leads injectés", val: "290" }, { label: "RDV obtenus", val: "53" }, { label: "Inscrits", val: "21" }, { label: "CA généré", val: "31 500€" }], team: "5 agents — 3 mois", accent: "border-t-purple-500" },
            ].map(({ sector, badge, badgeColor, stats, team, accent }) => (
              <div key={sector} className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm border-t-4 ${accent}`}>
                <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border mb-3 ${badgeColor}`}>{badge}</div>
                <div className="text-slate-800 font-bold mb-1">{sector}</div>
                <div className="text-slate-400 text-xs mb-5">{team}</div>
                <div className="space-y-3 divide-y divide-slate-100">
                  {stats.map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between pt-3 first:pt-0">
                      <span className="text-slate-500 text-sm">{label}</span>
                      <span className="text-slate-900 font-bold text-sm">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <CtaPrimary label="Réserver un appel diagnostic" href="#contact" />
            <CtaSecondary label="Voir comment ça fonctionne" href="#methode" />
          </div>
        </div>
      </section>

      {/* ── MÉTHODE ── */}
      <section id="methode" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 text-xs font-bold tracking-widest uppercase rounded-full mb-4">LA MÉTHODE</div>
            <h2 className="text-4xl font-black text-slate-900 mb-3">LE SYSTÈME <span className="text-blue-600">S.C.A.L.E.</span>™</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Transformez un flux de leads en rendez-vous qualifiés grâce à une machine humaine structurée.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', topColor: 'bg-blue-600', label: 'SOURCER', title: 'Génération de leads ciblée', desc: "Import CSV, CRM ou génération via SEO et publicités. Chaque lead est scoré avant traitement.", points: ['Import CSV / CRM / API', 'Scoring automatique', 'Segmentation par secteur'], textColor: 'text-blue-600' },
              { num: '02', topColor: 'bg-indigo-600', label: 'CONTACTER', title: 'Multi-canal sous 5 minutes', desc: "Appel, WhatsApp, email — nos agents contactent chaque lead en moins de 5 min avec relances sur 7 jours.", points: ['80–120 appels/agent/jour', 'WhatsApp + Email séquences', 'Relances J+1, J+3, J+7'], textColor: 'text-indigo-600', badge: 'PILIER CENTRAL' },
              { num: '03', topColor: 'bg-cyan-600', label: 'CLOSER', title: 'Qualification & RDV chauds', desc: "Chaque prospect est qualifié selon vos critères. Seuls les RDV chauds arrivent dans votre agenda.", points: ['Script de qualification custom', 'RDV sur votre agenda', "Suivi jusqu'au signing"], textColor: 'text-cyan-600' },
            ].map(({ num, topColor, label, title, desc, points, textColor, badge }) => (
              <div key={num} className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden">
                {badge && <div className="absolute top-4 right-4 px-2.5 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">{badge}</div>}
                <div className={`${topColor} h-1.5 w-full`} />
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4 font-black text-slate-600 text-sm">{num}</div>
                  <div className={`text-xs font-bold tracking-widest uppercase mb-2 ${textColor}`}>{label}</div>
                  <h3 className="text-slate-900 font-bold text-lg mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">{desc}</p>
                  <ul className="space-y-2">
                    {points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section id="processus" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 text-xs font-bold tracking-widest uppercase rounded-full mb-4">PARCOURS</div>
            <h2 className="text-4xl font-black text-slate-900 mb-3">DE ZÉRO À PIPELINE PLEIN<br /><span className="text-blue-600">EN 30 JOURS.</span></h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-100" />
            <div className="space-y-0">
              {[
                { num: '01', week: 'J 1–3', title: 'ONBOARDING & CONFIGURATION', desc: "Brief complet de votre offre. Script de qualification validé. CRM configuré à vos process.", tag: 'Setup', bg: 'bg-blue-600 text-white' },
                { num: '02', week: 'J 3–7', title: "FORMATION DE L'ÉQUIPE", desc: "Vos agents formés à votre pitch, personas et objections clés. Tests enregistrés et validés.", tag: 'Formation', bg: 'bg-indigo-600 text-white' },
                { num: '03', week: 'J 7–14', title: 'PREMIER BATCH DE LEADS', desc: "Premiers leads traités. Appels, relances WhatsApp, emails. Premiers RDV dans votre agenda.", tag: 'Lancement', bg: 'bg-cyan-600 text-white' },
                { num: '04', week: 'J 14–21', title: 'OPTIMISATION SCRIPTS', desc: "A/B test sur les 100 premiers appels. Objections identifiées, réponses optimisées.", tag: 'Optimisation', bg: 'bg-teal-600 text-white' },
                { num: '05', week: 'J 21–30', title: 'MONTÉE EN RÉGIME', desc: "Volume doublé. Segmentation affinée. Reporting hebdomadaire. Flux de RDV constant.", tag: 'Scale', bg: 'bg-green-600 text-white' },
                { num: '06', week: 'M 3+', title: 'MACHINE COMMERCIALE', desc: "30–60 RDV qualifiés par mois par agent. KPIs stabilisés. Scaling en 48h sur demande.", tag: 'Résultats', bg: 'bg-slate-900 text-white' },
              ].map(({ num, week, title, desc, tag, bg }) => (
                <div key={num} className="relative flex gap-8 pb-6 pl-14 last:pb-0">
                  <div className={`absolute left-0 top-1 w-12 h-12 rounded-full ${bg} flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm`}>{num}</div>
                  <div className="flex-1 bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <div>
                        <span className="text-blue-600 text-xs font-bold">{week} — </span>
                        <span className="text-slate-800 font-bold">{title}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold whitespace-nowrap border border-blue-100">{tag}</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KPIs ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 text-xs font-bold tracking-widest uppercase rounded-full mb-4">PERFORMANCES</div>
            <h2 className="text-4xl font-black text-slate-900 mb-3">LES <span className="text-blue-600">5 MÉTRIQUES</span> QUI CHANGENT TOUT.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { val: '80–120', label: 'Appels / agent / jour', border: 'border-blue-200', bg: 'bg-blue-50', color: 'text-blue-700' },
              { val: '35%', label: 'Taux de contact moyen', border: 'border-cyan-200', bg: 'bg-cyan-50', color: 'text-cyan-700' },
              { val: '8–15', label: 'RDV / agent / semaine', border: 'border-purple-200', bg: 'bg-purple-50', color: 'text-purple-700' },
              { val: '+35%', label: 'Taux de conversion', border: 'border-green-200', bg: 'bg-green-50', color: 'text-green-700' },
            ].map(({ val, label, border, bg, color }) => (
              <div key={label} className={`rounded-2xl p-5 border ${border} ${bg} text-center`}>
                <div className={`text-3xl font-black ${color} mb-1`}>{val}</div>
                <div className="text-slate-600 text-xs">{label}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">LES 6 PILIERS DU SCALE CALL CENTER</h3>
              <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-bold border border-blue-200">1 RAPPORT HEBDO</div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-6 py-3 text-slate-400 text-xs uppercase tracking-widest">#</th>
                  <th className="text-left px-4 py-3 text-slate-400 text-xs uppercase tracking-widest">Pilier</th>
                  <th className="text-left px-4 py-3 text-slate-400 text-xs uppercase tracking-widest hidden md:table-cell">Objectif</th>
                  <th className="text-left px-4 py-3 text-slate-400 text-xs uppercase tracking-widest">Résultat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { num: '01', pilier: 'Sourcing', obj: 'Leads qualifiés en flux continu', result: 'Pipeline toujours plein' },
                  { num: '02', pilier: 'Contact', obj: 'Réponse en moins de 5 minutes', result: 'Taux de contact ×3' },
                  { num: '03', pilier: 'Qualification', obj: 'Identifier les besoins réels', result: 'RDV chauds uniquement' },
                  { num: '04', pilier: 'Relance', obj: 'Séquence sur 7 jours', result: 'Zéro lead oublié' },
                  { num: '05', pilier: 'Reporting', obj: 'KPIs en temps réel', result: 'Décisions data-driven' },
                  { num: '06', pilier: 'Optimisation', obj: 'A/B test scripts continus', result: 'Amélioration constante' },
                ].map(({ num, pilier, obj, result }, i) => (
                  <tr key={num} className={`border-b border-slate-100 hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-3.5 text-blue-600 font-bold text-sm">{num}</td>
                    <td className="px-4 py-3.5 text-slate-800 font-bold text-sm">{pilier}</td>
                    <td className="px-4 py-3.5 text-slate-500 text-sm hidden md:table-cell">{obj}</td>
                    <td className="px-4 py-3.5 text-green-600 text-sm font-medium">{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 text-xs font-bold tracking-widest uppercase rounded-full mb-4">TARIFICATION</div>
            <h2 className="text-4xl font-black text-slate-900 mb-3">PLUS VOUS SCALEZ,<br /><span className="text-blue-600">MOINS C'EST CHER.</span></h2>
            <p className="text-slate-500">Logique économique simple : le prix baisse quand le volume monte.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { name: 'Starter', price: '900€', sub: '/agent/mois', min: 'Minimum 3 agents', total: '2 700€ / mois', totalLabel: 'pour 3 agents', features: ['Scripts fournis et optimisés', 'Reporting hebdomadaire', 'WhatsApp + Email templates', '1 responsable inclus', 'Intégration CRM incluse'], cta: 'Démarrer à 3 agents', highlight: false },
              { name: 'Growth', price: '850€', sub: '/agent/mois', min: 'Minimum 5 agents', total: '4 250€ / mois', totalLabel: 'pour 5 agents', features: ['Tout du plan Starter', 'Séquences de relance auto', 'A/B testing scripts', 'Analytics avancés', 'Scoring IA des leads', 'Call recording & review'], cta: 'Choisir Growth', highlight: true, badge: 'POPULAIRE' },
              { name: 'Scale', price: '800€', sub: '/agent/mois', min: '10 agents ou plus', total: 'Dès 8 000€ / mois', totalLabel: 'pour 10 agents', features: ['Tout du plan Growth', 'Équipe multi-secteur dédiée', 'Intégration CRM custom', 'API & webhooks', 'Account manager dédié', 'SLA garanti'], cta: 'Nous contacter', highlight: false },
            ].map(({ name, price, sub, min, total, totalLabel, features, cta, highlight, badge }) => (
              <div key={name} className={`relative rounded-2xl p-6 border shadow-sm ${highlight ? 'bg-blue-600 border-blue-500 shadow-blue-200 shadow-xl' : 'bg-white border-slate-200'}`}>
                {badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded-full shadow-sm">{badge}</div>}
                <div className="mb-5">
                  <div className={`text-sm font-bold mb-1 ${highlight ? 'text-blue-100' : 'text-slate-500'}`}>{name}</div>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-black ${highlight ? 'text-white' : 'text-slate-900'}`}>{price}</span>
                    <span className={`text-sm pb-1 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{sub}</span>
                  </div>
                  <div className={`text-xs mt-1 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{min}</div>
                  <div className={`mt-3 px-3 py-2 rounded-xl text-sm font-bold ${highlight ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    = {total} <span className="font-normal text-xs opacity-70">({totalLabel})</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${highlight ? 'text-blue-50' : 'text-slate-600'}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-yellow-300' : 'text-green-500'}`} />{f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block w-full py-3 rounded-xl text-center text-sm font-bold transition-all ${highlight ? 'bg-white text-blue-700 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'}`}>{cta}</a>
              </div>
            ))}
          </div>
          <div className="rounded-xl px-6 py-4 border border-blue-100 bg-blue-50 text-center text-sm text-blue-800">
            💡 <strong>Logiciel téléphonique et outils à la charge du client.</strong> Intégration sur votre CRM existant incluse dans tous les plans. Engagement minimum 3 mois.
          </div>
        </div>
      </section>

      {/* ── UPSELL DASHBOARD ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyan-200 text-cyan-700 bg-cyan-50 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              <Zap className="w-3 h-3" /> OPTION COMPLÉMENTAIRE
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-3">PILOTEZ VOTRE PERFORMANCE<br /><span className="text-cyan-600">EN TEMPS RÉEL</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Accédez à votre tableau de bord CRM et suivez chaque euro investi.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Activity className="w-5 h-5 text-cyan-600" />, title: "Suivi des leads traités", desc: "Visualisez en temps réel le statut de chaque lead : contacté, relancé, qualifié, RDV pris.", bg: 'bg-cyan-50 border-cyan-100' },
                  { icon: <Users className="w-5 h-5 text-blue-600" />, title: "Performance par agent", desc: "Nombre d'appels, taux de contact, RDV obtenus — par agent, par jour, par semaine.", bg: 'bg-blue-50 border-blue-100' },
                  { icon: <BarChart3 className="w-5 h-5 text-indigo-600" />, title: "Taux de contact et RDV", desc: "Courbes de progression, objectifs vs réalisé, alertes en cas de sous-performance.", bg: 'bg-indigo-50 border-indigo-100' },
                  { icon: <PieChart className="w-5 h-5 text-green-600" />, title: "Vision claire du ROI", desc: "CA généré, coût par RDV, rentabilité — tout en un tableau.", bg: 'bg-green-50 border-green-100' },
                ].map(({ icon, title, desc, bg }) => (
                  <div key={title} className={`flex gap-4 rounded-xl p-4 border ${bg}`}>
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-white">{icon}</div>
                    <div>
                      <div className="text-slate-800 font-bold text-sm">{title}</div>
                      <div className="text-slate-500 text-sm mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-5 border border-cyan-200 bg-cyan-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-black text-slate-900">+200€<span className="text-slate-400 text-base font-normal"> /mois</span></div>
                    <div className="text-slate-500 text-xs mt-0.5">En complément de votre forfait agent</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-700 text-xs font-bold bg-cyan-100 px-2 py-1 rounded-full border border-cyan-200">ACCÈS ILLIMITÉ</div>
                  </div>
                </div>
                <a href="#contact" className="block w-full py-3 rounded-xl text-center text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-sm">
                  Activer le dashboard →
                </a>
              </div>
            </div>
            <div><DashboardVisual /></div>
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section id="articles" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">RESSOURCES GRATUITES</div>
              <h2 className="text-4xl font-black text-slate-900">GUIDES CALL CENTER B2B</h2>
            </div>
            <Link href="/articles" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-500 text-sm font-bold transition-colors">
              Tous les guides <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { cat: 'PROSPECTION & SCRIPTS', catColor: 'text-blue-700 border-blue-200 bg-blue-50', title: 'Script téléprospection B2B : le guide complet 2026', desc: 'Passer les secrétaires, engager le décideur, décrocher le RDV en moins de 3 minutes.', read: '8 min', tags: ['Script', 'Closing'] },
              { cat: 'MANAGEMENT', catColor: 'text-purple-700 border-purple-200 bg-purple-50', title: 'Les 12 KPIs call center que tout manager doit suivre', desc: "Taux de contact, durée d'appel, coût par lead — quoi mesurer et comment optimiser.", read: '10 min', tags: ['KPIs', 'Management'] },
              { cat: 'GÉNÉRATION DE LEADS', catColor: 'text-cyan-700 border-cyan-200 bg-cyan-50', title: 'SEO + Ads + cold calling : le pipeline inarrêtable', desc: "Stratégie multi-canal pour générer 100+ leads qualifiés par mois sans dépendre d'une seule source.", read: '11 min', tags: ['SEO', 'Leads'] },
              { cat: 'OPTIMISATION', catColor: 'text-green-700 border-green-200 bg-green-50', title: 'A/B testing de scripts : doubler votre taux de RDV', desc: "Framework pour tester, mesurer et itérer sur vos scripts d'appel pour améliorer la conversion.", read: '7 min', tags: ['Test', 'Conversion'] },
              { cat: 'RECRUTEMENT', catColor: 'text-orange-700 border-orange-200 bg-orange-50', title: 'Recruter un agent call center performant en 2 semaines', desc: "Profil idéal, onboarding, évaluation des premières semaines — tout le playbook RH.", read: '9 min', tags: ['RH', 'Formation'] },
              { cat: 'WHATSAPP & EMAIL', catColor: 'text-pink-700 border-pink-200 bg-pink-50', title: '15 templates WhatsApp B2B qui décrochent des réponses', desc: "Messages de prospection testés sur des milliers d'envois, avec taux de réponse réels.", read: '6 min', tags: ['WhatsApp', 'Templates'] },
            ].map(({ cat, catColor, title, desc, read, tags }) => (
              <Link href="/articles" key={title} className="group bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden block">
                <div className="p-5">
                  <div className={`inline-block text-xs font-bold tracking-widest uppercase px-2 py-1 rounded-full border mb-4 ${catColor}`}>{cat}</div>
                  <h3 className="text-slate-800 font-bold text-sm leading-snug mb-3 group-hover:text-blue-600 transition-colors">{title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">{tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>)}</div>
                    <span className="text-blue-600 text-xs flex items-center gap-1 font-medium">{read} <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL (dark) ── */}
      <section id="contact" className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              <span className="text-slate-400 text-sm ml-2">Recommandé par nos clients</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-4">ET SI EN 30 JOURS,<br /><span className="text-blue-400">VOTRE PIPELINE ÉTAIT PLEIN ?</span></h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
              ScaleWithMike, c'est l'équipe qui transforme vos leads en rendez-vous qualifiés — structurée, pilotée, opérationnelle en 7 jours.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <LeadForm dark />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
            {["Sans engagement au-delà de 3 mois", "Démarrage en 7 jours", "Équipe 100% francophone"].map(g => (
              <span key={g} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" />{g}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="font-black text-slate-800 text-lg"><span className="text-yellow-500">⚡</span> ScaleWithMike</div>
          <div className="flex gap-6">
            {[["#methode", "La Méthode"], ["#processus", "Processus"], ["#articles", "Ressources"], ["#contact", "Contact"]].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-blue-600 transition-colors">{label}</a>
            ))}
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">CRM</Link>
          </div>
          <div className="text-xs text-slate-400">m.simono@groupe-fc.com • © 2026 ScaleWithMike</div>
        </div>
      </footer>
    </div>
  )
}
