'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, CheckCircle2, TrendingUp, Users, Target, BarChart3, Calendar, ArrowUpRight, Star, Play, Activity, PieChart, Zap } from 'lucide-react'

// ─── BG STYLES ────────────────────────────────────────────────────────────────
const bgDark = { background: '#080f1e' }
const bgMid = { background: '#0c1525' }
const bgLight = { background: '#111d35' }

const gridStyle = {
  backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
  backgroundSize: '60px 60px',
}

// ─── CTA BUTTONS ──────────────────────────────────────────────────────────────
function CtaPrimary({ label = "Réserver un appel", href = "#contact" }: { label?: string; href?: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-blue-500/20">
      <Phone className="w-4 h-4" />
      {label}
    </a>
  )
}
function CtaSecondary({ label = "Voir comment ça fonctionne", href = "#methode" }: { label?: string; href?: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all text-sm bg-white/5 hover:bg-white/10">
      <Play className="w-4 h-4" />
      {label}
    </a>
  )
}

// ─── LEAD FORM ────────────────────────────────────────────────────────────────
function LeadForm() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  if (submitted) {
    return (
      <div className="rounded-2xl p-8 text-center bg-green-500/10 border border-green-500/30">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="text-white font-bold text-lg">Demande envoyée !</p>
        <p className="text-slate-300 text-sm mt-2">Notre équipe vous rappelle sous 24h ouvrées.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
      <p className="text-center text-white font-bold text-sm mb-1 tracking-wide uppercase">Accéder au diagnostic gratuit</p>
      <p className="text-center text-slate-400 text-xs mb-5">Réponse sous 24h — Sans engagement</p>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/25 rounded-xl px-3 py-3 transition-colors">
            <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Prénom" className="bg-transparent text-white placeholder-slate-500 text-sm outline-none w-full" />
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/25 rounded-xl px-3 py-3 transition-colors">
            <span className="text-blue-400 text-sm flex-shrink-0">@</span>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email pro" className="bg-transparent text-white placeholder-slate-500 text-sm outline-none w-full" />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/25 rounded-xl px-3 py-3 transition-colors">
          <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Téléphone / WhatsApp" className="bg-transparent text-white placeholder-slate-500 text-sm outline-none w-full" />
        </div>
        <button onClick={() => setSubmitted(true)} className="w-full py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-blue-500/20">
          Réserver mon appel diagnostic →
        </button>
        <button onClick={() => setSubmitted(true)} className="w-full py-2.5 border border-white/15 text-slate-300 text-sm rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" /> On vous rappelle directement
        </button>
      </div>
    </div>
  )
}

// ─── MINI DASHBOARD VISUAL ────────────────────────────────────────────────────
function DashboardVisual() {
  return (
    <div className="bg-[#0a1628] rounded-2xl border border-blue-900/60 overflow-hidden shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-2 text-slate-500 text-xs">ScaleWithMike CRM — Dashboard</span>
      </div>
      {/* Stats row */}
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
            <div className="text-green-400 text-xs mt-0.5">{delta} ce mois</div>
          </div>
        ))}
      </div>
      {/* Chart area */}
      <div className="p-4 flex gap-4">
        {/* Fake bar chart */}
        <div className="flex-1">
          <div className="text-slate-400 text-xs mb-3 font-medium">RDV par semaine</div>
          <div className="flex items-end gap-1.5 h-20">
            {[40, 65, 55, 80, 70, 90, 75, 95, 85, 100, 88, 92].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 11 ? '#3b82f6' : `rgba(59,130,246,${0.2 + i * 0.05})` }} />
            ))}
          </div>
          <div className="flex justify-between text-slate-600 text-xs mt-1">
            <span>Jan</span><span>Avr</span>
          </div>
        </div>
        {/* Agent leaderboard mini */}
        <div className="w-40">
          <div className="text-slate-400 text-xs mb-3 font-medium">Top agents</div>
          <div className="space-y-2">
            {[
              { name: 'Sophie L.', rdv: 23, color: 'bg-yellow-400' },
              { name: 'Marc D.', rdv: 19, color: 'bg-slate-400' },
              { name: 'Julie M.', rdv: 16, color: 'bg-orange-500' },
            ].map(({ name, rdv, color }) => (
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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="text-white font-sans overflow-x-hidden" style={bgDark}>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 backdrop-blur-md" style={{ background: 'rgba(8,15,30,0.92)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight">
            <span className="text-yellow-400">⚡</span>
            <span>Scale</span><span className="text-blue-400">With</span><span>Mike</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#methode" className="hover:text-white transition-colors">La Méthode</a>
            <a href="#processus" className="hover:text-white transition-colors">Processus</a>
            <a href="#resultats" className="hover:text-white transition-colors">Résultats</a>
            <a href="#articles" className="hover:text-white transition-colors">Ressources</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">
              Accéder au CRM
            </Link>
            <a href="#contact" className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
              Prendre un RDV
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20" style={{ ...bgDark, ...gridStyle }}>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 left-1/5 w-56 h-56 rounded-full opacity-6 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Call Center Externalisé B2B — 100% Francophone
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                REMPLISSEZ<br />
                VOTRE AGENDA DE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  RDV QUALIFIÉS
                </span>
              </h1>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Une équipe de téléprospecteurs dédiée qui contacte vos leads,
                qualifie leurs besoins et remplit votre pipeline — opérationnelle en 7 jours.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Dès 800€ / agent / mois", "Opérationnel en 7 jours", "Responsable inclus", "+35% taux de conversion"].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <CtaPrimary label="Réserver un appel diagnostic" href="#contact" />
                <CtaSecondary label="Voir comment ça fonctionne" href="#methode" />
              </div>
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/8 text-sm">
                {[{ val: '+200', label: 'RDV / mois' }, { val: '98%', label: 'Satisfaction' }, { val: '7 jours', label: 'Démarrage' }].map(({ val, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-black text-white">{val}</div>
                    <div className="text-slate-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <LeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="border-y border-white/6 py-5" style={bgMid}>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-8 items-center">
          {["Industrie & BTP", "Services B2B", "Immobilier", "Tech / SaaS", "Formation professionnelle"].map(s => (
            <span key={s} className="text-slate-400 text-sm font-medium">{s}</span>
          ))}
          <span className="text-slate-600 text-xs hidden md:block">Secteurs actifs</span>
        </div>
      </div>

      {/* ── PROBLÈME ── */}
      <section className="py-24" style={bgMid}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">LE PROBLÈME</div>
              <h2 className="text-4xl font-black mb-6 leading-tight text-white">
                Vos commerciaux closent.<br />
                <span className="text-blue-400">Mais qui prospecte ?</span>
              </h2>
              <div className="space-y-4 text-slate-300">
                {[
                  "Vos closers perdent 60% de leur temps à rappeler des leads froids au lieu de signer",
                  "Chaque lead non contacté dans les 5 minutes perd 80% de ses chances de conversion",
                  "Recruter une équipe interne prend 3 à 6 mois et coûte 3× plus cher",
                ].map((text, i) => (
                  <p key={i} className="flex gap-3 items-start">
                    <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">✗</span>
                    <span>{text}</span>
                  </p>
                ))}
              </div>
              <blockquote className="mt-8 pl-4 border-l-2 border-blue-500 text-slate-300 italic text-lg">
                "Le vrai frein à votre croissance, ce n'est pas votre offre. C'est votre pipeline."
              </blockquote>
            </div>
            <div className="rounded-2xl p-7 border border-white/10" style={bgLight}>
              <div className="text-slate-400 text-xs uppercase tracking-widest mb-6 font-bold">La réalité de vos leads aujourd'hui</div>
              <div className="space-y-4">
                {[
                  { label: 'Leads jamais contactés', pct: 45, color: 'bg-red-500' },
                  { label: 'Relances insuffisantes', pct: 30, color: 'bg-orange-500' },
                  { label: 'Contactés mais mal qualifiés', pct: 15, color: 'bg-yellow-500' },
                  { label: 'Traitement optimal', pct: 10, color: 'bg-green-500' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
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
      <section id="resultats" className="py-24" style={{ ...bgDark, ...gridStyle }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">PREUVES RÉELLES</div>
            <h2 className="text-4xl font-black text-white">RÉSULTATS <span className="text-green-400">CONCRETS</span></h2>
            <p className="text-slate-400 mt-3">Exemples de performances réelles sur 90 jours</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                sector: "Services B2B / Conseil",
                badge: "🏆 Meilleur ROI",
                badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
                stats: [
                  { label: "Leads injectés", val: "520", icon: <Users className="w-4 h-4" /> },
                  { label: "RDV obtenus", val: "94", icon: <Calendar className="w-4 h-4" /> },
                  { label: "Contrats signés", val: "17", icon: <CheckCircle2 className="w-4 h-4" /> },
                  { label: "CA généré", val: "68 000€", icon: <TrendingUp className="w-4 h-4" /> },
                ],
                team: "6 agents / 3 mois",
                color: "border-yellow-500/30"
              },
              {
                sector: "Industrie / Équipement",
                badge: "⚡ Scale rapide",
                badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
                stats: [
                  { label: "Leads injectés", val: "380", icon: <Users className="w-4 h-4" /> },
                  { label: "RDV obtenus", val: "61", icon: <Calendar className="w-4 h-4" /> },
                  { label: "Contrats signés", val: "11", icon: <CheckCircle2 className="w-4 h-4" /> },
                  { label: "CA généré", val: "44 000€", icon: <TrendingUp className="w-4 h-4" /> },
                ],
                team: "5 agents / 3 mois",
                color: "border-blue-500/30"
              },
              {
                sector: "Formation Pro / Coaching",
                badge: "📈 Croissance",
                badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
                stats: [
                  { label: "Leads injectés", val: "290", icon: <Users className="w-4 h-4" /> },
                  { label: "RDV obtenus", val: "53", icon: <Calendar className="w-4 h-4" /> },
                  { label: "Inscrits", val: "21", icon: <CheckCircle2 className="w-4 h-4" /> },
                  { label: "CA généré", val: "31 500€", icon: <TrendingUp className="w-4 h-4" /> },
                ],
                team: "5 agents / 3 mois",
                color: "border-purple-500/30"
              },
            ].map(({ sector, badge, badgeColor, stats, team, color }) => (
              <div key={sector} className={`rounded-2xl p-6 border ${color}`} style={bgLight}>
                <div className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border mb-3 ${badgeColor}`}>{badge}</div>
                <div className="text-white font-bold mb-1">{sector}</div>
                <div className="text-slate-500 text-xs mb-5">{team}</div>
                <div className="space-y-3">
                  {stats.map(({ label, val, icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="text-blue-400">{icon}</span> {label}
                      </div>
                      <span className="text-white font-bold text-sm">{val}</span>
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
      <section id="methode" className="py-24" style={bgMid}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">LA MÉTHODE</div>
            <h2 className="text-4xl font-black text-white mb-3">LE SYSTÈME <span className="text-blue-400">S.C.A.L.E.</span>™</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Transformez un flux de leads en rendez-vous qualifiés grâce à une machine humaine structurée.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', col: 'from-blue-600 to-blue-700', border: 'border-blue-500/30', label: 'SOURCER', title: 'Génération de leads ciblée', desc: "Import CSV, CRM ou génération via SEO et publicités. Chaque lead est scoré avant traitement.", points: ['Import CSV / CRM / API', 'Scoring automatique', 'Segmentation par secteur'] },
              { num: '02', col: 'from-purple-600 to-purple-700', border: 'border-purple-500/30', label: 'CONTACTER', title: 'Multi-canal sous 5 minutes', desc: "Appel, WhatsApp, email — nos agents contactent chaque lead en moins de 5 min. Relances sur 7 jours.", points: ['80–120 appels/agent/jour', 'WhatsApp + Email séquences', 'Relances J+1, J+3, J+7'], badge: 'PILIER CENTRAL' },
              { num: '03', col: 'from-cyan-600 to-cyan-700', border: 'border-cyan-500/30', label: 'CLOSER', title: 'Qualification & RDV chauds', desc: "Chaque prospect est qualifié selon vos critères. Seuls les RDV chauds arrivent dans votre agenda.", points: ['Script de qualification custom', 'RDV sur votre agenda', "Suivi jusqu'au signing"] },
            ].map(({ num, col, border, label, title, desc, points, badge }) => (
              <div key={num} className={`relative rounded-2xl p-6 border ${border} hover:border-opacity-60 transition-all`} style={bgLight}>
                {badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full whitespace-nowrap">{badge}</div>}
                <div className="text-7xl font-black text-white/4 absolute top-3 right-4 leading-none select-none">{num}</div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${col} flex items-center justify-center mb-4 text-white font-black text-sm`}>{num}</div>
                <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">{label}</div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
                <ul className="space-y-1.5">
                  {points.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section id="processus" className="py-24" style={{ ...bgDark, ...gridStyle }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">PARCOURS</div>
            <h2 className="text-4xl font-black text-white mb-3">DE ZÉRO À PIPELINE PLEIN<br /><span className="text-blue-400">EN 30 JOURS.</span></h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #3b82f6, rgba(59,130,246,0.1))' }} />
            <div className="space-y-0">
              {[
                { num: '01', week: 'J 1–3', title: 'ONBOARDING & CONFIGURATION', desc: "Brief complet de votre offre. Script de qualification validé. CRM configuré à vos process.", tag: 'Setup', color: 'border-blue-500 text-blue-400' },
                { num: '02', week: 'J 3–7', title: "FORMATION DE L'ÉQUIPE", desc: "Vos agents formés à votre pitch, personas et objections clés. Tests enregistrés et validés.", tag: 'Formation', color: 'border-purple-500 text-purple-400' },
                { num: '03', week: 'J 7–14', title: 'PREMIER BATCH DE LEADS', desc: "Premiers leads traités. Appels, relances WhatsApp, emails. Premiers RDV dans votre agenda.", tag: 'Lancement', color: 'border-cyan-500 text-cyan-400' },
                { num: '04', week: 'J 14–21', title: 'OPTIMISATION SCRIPTS', desc: "A/B test sur les 100 premiers appels. Objections identifiées, réponses optimisées.", tag: 'Optimisation', color: 'border-green-500 text-green-400' },
                { num: '05', week: 'J 21–30', title: 'MONTÉE EN RÉGIME', desc: "Volume doublé. Segmentation affinée. Reporting hebdomadaire. Flux de RDV constant.", tag: 'Scale', color: 'border-yellow-500 text-yellow-400' },
                { num: '06', week: 'M 3+', title: 'MACHINE COMMERCIALE', desc: "30–60 RDV qualifiés par mois par agent. KPIs stabilisés. Scaling en 48h sur demande.", tag: 'Résultats', color: 'border-orange-500 text-orange-400' },
              ].map(({ num, week, title, desc, tag, color }) => (
                <div key={num} className="relative flex gap-8 pb-8 pl-14 last:pb-0">
                  <div className={`absolute left-0 top-1 w-12 h-12 rounded-full border-2 ${color} flex items-center justify-center font-black text-sm flex-shrink-0`} style={bgDark}>{num}</div>
                  <div className="flex-1 rounded-xl p-5 border border-white/8 hover:border-white/15 transition-colors" style={bgLight}>
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <div>
                        <span className="text-blue-400 text-xs font-bold">{week} — </span>
                        <span className="text-white font-bold">{title}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold whitespace-nowrap">{tag}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── KPIs TABLE ── */}
      <section className="py-24" style={bgMid}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">PERFORMANCES</div>
            <h2 className="text-4xl font-black text-white mb-3">LES <span className="text-blue-400">5 MÉTRIQUES</span> QUI CHANGENT TOUT.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { val: '80–120', label: 'Appels / agent / jour', color: 'text-blue-400', border: 'border-blue-500/20' },
              { val: '35%', label: 'Taux de contact moyen', color: 'text-cyan-400', border: 'border-cyan-500/20' },
              { val: '8–15', label: 'RDV / agent / semaine', color: 'text-purple-400', border: 'border-purple-500/20' },
              { val: '+35%', label: 'Taux de conversion', color: 'text-green-400', border: 'border-green-500/20' },
            ].map(({ val, label, color, border }) => (
              <div key={label} className={`rounded-2xl p-5 border ${border} text-center`} style={bgLight}>
                <div className={`text-3xl font-black ${color} mb-1`}>{val}</div>
                <div className="text-slate-400 text-xs">{label}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={bgLight}>
            <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">LES 6 PILIERS DU SCALE CALL CENTER</h3>
              <div className="text-xs px-2 py-1 bg-blue-500/15 text-blue-400 rounded font-bold">1 RAPPORT HEBDO</div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left px-6 py-3 text-slate-500 text-xs uppercase tracking-widest">#</th>
                  <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-widest">Pilier</th>
                  <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-widest hidden md:table-cell">Objectif</th>
                  <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-widest">Résultat</th>
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
                  <tr key={num} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}>
                    <td className="px-6 py-3.5 text-blue-500 font-bold text-sm">{num}</td>
                    <td className="px-4 py-3.5 text-white font-bold text-sm">{pilier}</td>
                    <td className="px-4 py-3.5 text-slate-400 text-sm hidden md:table-cell">{obj}</td>
                    <td className="px-4 py-3.5 text-green-400 text-sm font-medium">{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24" style={{ ...bgDark, ...gridStyle }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">TARIFICATION</div>
            <h2 className="text-4xl font-black text-white mb-3">PLUS VOUS SCALEZ,<br /><span className="text-blue-400">MOINS C'EST CHER.</span></h2>
            <p className="text-slate-400">Logique économique simple : le prix baisse quand le volume monte.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              {
                name: 'Starter', price: '900€', sub: '/agent/mois', min: 'Minimum 3 agents',
                total: '2 700€ / mois', totalLabel: 'pour 3 agents',
                features: ['Scripts fournis et optimisés', 'Reporting hebdomadaire', 'WhatsApp + Email templates', '1 responsable inclus', 'Intégration CRM incluse'],
                cta: 'Démarrer à 3 agents', highlight: false, border: 'border-white/10'
              },
              {
                name: 'Growth', price: '850€', sub: '/agent/mois', min: 'Minimum 5 agents',
                total: '4 250€ / mois', totalLabel: 'pour 5 agents',
                features: ['Tout du plan Starter', 'Séquences de relance auto', 'A/B testing scripts', 'Analytics avancés', 'Scoring IA des leads', 'Call recording & review'],
                cta: 'Choisir Growth', highlight: true, badge: 'POPULAIRE', border: 'border-blue-400'
              },
              {
                name: 'Scale', price: '800€', sub: '/agent/mois', min: '10 agents ou plus',
                total: 'Dès 8 000€ / mois', totalLabel: 'pour 10 agents',
                features: ['Tout du plan Growth', 'Équipe multi-secteur dédiée', 'Intégration CRM custom', 'API & webhooks', 'Account manager dédié', 'SLA garanti'],
                cta: 'Nous contacter', highlight: false, border: 'border-white/10'
              },
            ].map(({ name, price, sub, min, total, totalLabel, features, cta, highlight, badge, border }) => (
              <div key={name} className={`relative rounded-2xl p-6 border ${border}`} style={{ background: highlight ? 'linear-gradient(145deg, #1e3a6e, #0d1f4a)' : '#111d35' }}>
                {badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded-full">{badge}</div>}
                <div className="mb-5">
                  <div className="text-slate-300 text-sm font-bold mb-1">{name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">{price}</span>
                    <span className={`text-sm pb-1 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{sub}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{min}</div>
                  <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-bold ${highlight ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-slate-300'}`}>
                    = {total} <span className="font-normal text-xs opacity-70">({totalLabel})</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${highlight ? 'text-blue-100' : 'text-slate-300'}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-yellow-300' : 'text-green-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block w-full py-3 rounded-xl text-center text-sm font-bold transition-all ${highlight ? 'bg-white text-blue-700 hover:bg-blue-50' : 'border border-white/20 text-slate-300 hover:bg-white/5'}`}>
                  {cta}
                </a>
              </div>
            ))}
          </div>
          <div className="rounded-xl px-6 py-4 border border-white/8 text-center text-sm text-slate-400" style={bgMid}>
            💡 <strong className="text-slate-200">Logiciel téléphonique et outils à la charge du client.</strong> Intégration sur votre CRM existant incluse dans tous les plans. Engagement minimum 3 mois.
          </div>
        </div>
      </section>

      {/* ── UPSELL DASHBOARD ── */}
      <section className="py-24 border-t border-white/6" style={bgMid}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              <Zap className="w-3 h-3" /> OPTION COMPLÉMENTAIRE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">PILOTEZ VOTRE PERFORMANCE<br /><span className="text-cyan-400">EN TEMPS RÉEL</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Accédez à votre tableau de bord CRM et suivez chaque euro investi.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Activity className="w-5 h-5 text-cyan-400" />, title: "Suivi des leads traités", desc: "Visualisez en temps réel le statut de chaque lead : contacté, relancé, qualifié, RDV pris." },
                  { icon: <Users className="w-5 h-5 text-blue-400" />, title: "Performance par agent", desc: "Nombre d'appels, taux de contact, RDV obtenus — par agent, par jour, par semaine." },
                  { icon: <BarChart3 className="w-5 h-5 text-purple-400" />, title: "Taux de contact et RDV", desc: "Courbes de progression, objectifs vs réalisé, alertes en cas de sous-performance." },
                  { icon: <PieChart className="w-5 h-5 text-green-400" />, title: "Vision claire du ROI", desc: "CA généré, coût par RDV, rentabilité de l'investissement — tout en un tableau." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10" style={bgDark}>{icon}</div>
                    <div>
                      <div className="text-white font-bold text-sm">{title}</div>
                      <div className="text-slate-400 text-sm mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-5 border border-cyan-500/25" style={bgLight}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-2xl font-black text-white">+200€<span className="text-slate-400 text-sm font-normal"> /mois</span></div>
                    <div className="text-slate-400 text-xs mt-0.5">En complément de votre forfait agent</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 text-xs font-bold">ACCÈS ILLIMITÉ</div>
                    <div className="text-slate-500 text-xs">pour toute votre équipe</div>
                  </div>
                </div>
                <a href="#contact" className="block w-full py-3 rounded-xl text-center text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white transition-all">
                  Activer le dashboard →
                </a>
              </div>
            </div>
            <div>
              <DashboardVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section id="articles" className="py-24" style={{ ...bgDark, ...gridStyle }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">RESSOURCES GRATUITES</div>
              <h2 className="text-4xl font-black text-white">GUIDES CALL CENTER B2B</h2>
            </div>
            <Link href="/articles" className="hidden md:flex items-center gap-2 text-blue-400 hover:text-white text-sm font-bold transition-colors">
              Tous les guides <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { cat: 'PROSPECTION & SCRIPTS', catColor: 'text-blue-400 border-blue-500/30', title: 'Script téléprospection B2B : le guide complet 2026', desc: 'Passer les secrétaires, engager le décideur, décrocher le RDV en moins de 3 minutes.', read: '8 min', tags: ['Script', 'Closing'] },
              { cat: 'MANAGEMENT', catColor: 'text-purple-400 border-purple-500/30', title: 'Les 12 KPIs call center que tout manager doit suivre', desc: "Taux de contact, durée d'appel, coût par lead — quoi mesurer et comment optimiser.", read: '10 min', tags: ['KPIs', 'Management'] },
              { cat: 'GÉNÉRATION DE LEADS', catColor: 'text-cyan-400 border-cyan-500/30', title: 'SEO + Ads + cold calling : le pipeline inarrêtable', desc: 'Stratégie multi-canal pour générer 100+ leads qualifiés par mois sans dépendre d\'une seule source.', read: '11 min', tags: ['SEO', 'Leads'] },
              { cat: 'OPTIMISATION', catColor: 'text-green-400 border-green-500/30', title: 'A/B testing de scripts : doubler votre taux de RDV', desc: 'Framework pour tester, mesurer et itérer sur vos scripts pour améliorer votre conversion.', read: '7 min', tags: ['Test', 'Conversion'] },
              { cat: 'RECRUTEMENT', catColor: 'text-orange-400 border-orange-500/30', title: 'Recruter un agent call center performant en 2 semaines', desc: "Profil idéal, onboarding, évaluation des premières semaines — tout le playbook RH.", read: '9 min', tags: ['RH', 'Formation'] },
              { cat: 'WHATSAPP & EMAIL', catColor: 'text-pink-400 border-pink-500/30', title: '15 templates WhatsApp B2B qui décrochent des réponses', desc: 'Messages de prospection testés sur des milliers d\'envois, avec taux de réponse réels.', read: '6 min', tags: ['WhatsApp', 'Templates'] },
            ].map(({ cat, catColor, title, desc, read, tags }) => (
              <Link href="/articles" key={title} className="group rounded-xl border border-white/8 hover:border-white/20 transition-all overflow-hidden block" style={bgLight}>
                <div className="p-5">
                  <div className={`inline-block text-xs font-bold tracking-widest uppercase px-2 py-1 rounded border ${catColor} bg-white/3 mb-4`}>{cat}</div>
                  <h3 className="text-white font-bold text-sm leading-snug mb-3 group-hover:text-blue-300 transition-colors">{title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">{tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400">{t}</span>)}</div>
                    <span className="text-blue-400 text-xs flex items-center gap-1">{read} <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section id="contact" className="py-24" style={bgMid}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              <span className="text-slate-400 text-sm ml-2">Recommandé par nos clients</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-4">
              ET SI EN 30 JOURS,<br />
              <span className="text-blue-400">VOTRE PIPELINE ÉTAIT PLEIN ?</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
              ScaleWithMike, c'est l'équipe qui transforme vos leads en rendez-vous qualifiés — structurée, pilotée, opérationnelle en 7 jours.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <LeadForm />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
            {["Sans engagement au-delà de 3 mois", "Démarrage en 7 jours", "Équipe 100% francophone"].map(g => (
              <span key={g} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" />{g}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-10" style={bgDark}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="font-black text-white text-lg"><span className="text-yellow-400">⚡</span> ScaleWithMike</div>
          <div className="flex gap-6">
            {["#methode", "#processus", "#articles", "#contact"].map((href, i) => (
              <a key={href} href={href} className="hover:text-white transition-colors">{["La Méthode", "Processus", "Ressources", "Contact"][i]}</a>
            ))}
            <Link href="/dashboard" className="hover:text-white transition-colors">CRM</Link>
          </div>
          <div className="text-xs">m.simono@groupe-fc.com • © 2026 ScaleWithMike</div>
        </div>
      </footer>
    </div>
  )
}
