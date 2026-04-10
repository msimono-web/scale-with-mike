'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Phone, ChevronRight, CheckCircle2, TrendingUp, Users, Target, Zap, BarChart3, MessageSquare, FileText, Calendar, ArrowUpRight } from 'lucide-react'

// ─── LEAD FORM ────────────────────────────────────────────────────────────────
function LeadForm({ variant = 'hero' }: { variant?: 'hero' | 'cta' }) {
  const [submitted, setSubmitted] = useState(false)
  const isHero = variant === 'hero'

  if (submitted) {
    return (
      <div className={`rounded-xl p-8 text-center ${isHero ? 'bg-white/10 border border-white/20' : 'bg-[#0d1f4a] border border-blue-500/30'}`}>
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="text-white font-bold text-lg">Demande envoyée !</p>
        <p className="text-blue-200 text-sm mt-1">Notre équipe vous rappelle sous 24h.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl p-6 ${isHero ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-[#0d1f4a] border border-blue-500/30'}`}>
      {isHero && (
        <p className="text-center text-white font-bold text-sm mb-4 tracking-widest uppercase">
          Vérifiez votre éligibilité — Réponse immédiate
        </p>
      )}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/20 rounded-lg px-3 py-2.5">
            <Users className="w-4 h-4 text-blue-300 flex-shrink-0" />
            <input placeholder="Prénom" className="bg-transparent text-white placeholder-blue-300 text-sm outline-none w-full" />
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/20 rounded-lg px-3 py-2.5">
            <span className="text-blue-300 text-xs flex-shrink-0">@</span>
            <input placeholder="Email professionnel" className="bg-transparent text-white placeholder-blue-300 text-sm outline-none w-full" />
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-lg px-3 py-2.5">
          <Phone className="w-4 h-4 text-blue-300 flex-shrink-0" />
          <input placeholder="Téléphone / WhatsApp" className="bg-transparent text-white placeholder-blue-300 text-sm outline-none w-full" />
        </div>
        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all text-sm tracking-wider uppercase"
        >
          Vérifier mon éligibilité →
        </button>
        <button
          onClick={() => setSubmitted(true)}
          className="w-full py-2.5 border border-white/30 text-white text-sm rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          On vous rappelle
        </button>
      </div>
    </div>
  )
}

// ─── GRID BACKGROUND ──────────────────────────────────────────────────────────
const gridStyle = {
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
}

const dotStyle = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
  backgroundSize: '30px 30px',
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="bg-[#060e1f] text-white font-sans overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#060e1f]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight">
            <span className="text-yellow-400">⚡</span>
            <span>Scale</span><span className="text-blue-400">With</span><span>Mike</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-blue-200">
            <a href="#methode" className="hover:text-white transition-colors">LA MÉTHODE</a>
            <a href="#processus" className="hover:text-white transition-colors">PROCESSUS</a>
            <a href="#resultats" className="hover:text-white transition-colors">RÉSULTATS</a>
            <a href="#articles" className="hover:text-white transition-colors">RESSOURCES</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-blue-300 hover:text-white transition-colors hidden md:block">
              Accéder au CRM →
            </Link>
            <a href="#contact" className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-lg transition-colors">
              REJOINDRE
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20" style={{ background: 'linear-gradient(135deg, #060e1f 0%, #0a1830 50%, #0d1f4a 100%)', ...gridStyle }}>
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Call Center Externalisé B2B — 100% Francophone
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                REMPLISSEZ<br />
                VOTRE AGENDA DE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  RDV QUALIFIÉS
                </span>
              </h1>

              <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                En 7 jours, déployez une équipe de téléprospecteurs dédiée
                qui contacte vos leads, qualifie leurs besoins et remplit
                votre pipeline — sans que vous leviez le petit doigt.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {['800€ / agent / mois', '5 agents minimum', 'Démarrage en 7j', '+35% taux de transfo'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-blue-200">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="hidden md:flex items-center gap-6 text-sm text-blue-300 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-black text-white">+200</div>
                  <div>RDV / mois</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-white">98%</div>
                  <div>Satisfaction client</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-white">3 mois</div>
                  <div>Pour voir les résultats</div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div>
              <LeadForm variant="hero" />
              <p className="text-center text-blue-400 text-xs mt-3">
                Réponse sous 24h • Sans engagement • 100% confidentiel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLÈME ── */}
      <section className="py-24 bg-[#07111f]" style={dotStyle}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-4">LE PROBLÈME</div>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Vos commerciaux closent.<br />
                <span className="text-blue-400">Mais qui prospecte ?</span>
              </h2>
              <div className="space-y-4 text-blue-200">
                <p className="flex gap-3">
                  <span className="text-red-400 mt-1 flex-shrink-0">✗</span>
                  Vos closers perdent 60% de leur temps à rappeler des leads froids au lieu de signer
                </p>
                <p className="flex gap-3">
                  <span className="text-red-400 mt-1 flex-shrink-0">✗</span>
                  Chaque lead non contacté dans les 5 minutes perd 80% de ses chances de conversion
                </p>
                <p className="flex gap-3">
                  <span className="text-red-400 mt-1 flex-shrink-0">✗</span>
                  Recruter et former une équipe interne prend 3 à 6 mois — et coûte 3x plus cher
                </p>
              </div>

              <blockquote className="mt-8 pl-4 border-l-2 border-blue-500 text-blue-200 italic text-lg">
                "Le vrai frein à votre croissance, ce n'est pas votre offre. C'est votre pipeline."
              </blockquote>
            </div>

            <div className="bg-[#0d1f4a] rounded-2xl p-8 border border-blue-900">
              <div className="text-blue-300 text-xs uppercase tracking-widest mb-6 font-bold">La réalité de vos leads aujourd'hui</div>
              <div className="space-y-4">
                {[
                  { label: 'Leads jamais contactés', pct: 45, color: 'bg-red-500' },
                  { label: 'Relances insuffisantes', pct: 30, color: 'bg-orange-500' },
                  { label: 'Contactés mais mal qualifiés', pct: 15, color: 'bg-yellow-500' },
                  { label: 'Traitement optimal', pct: 10, color: 'bg-green-500' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-200">{label}</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-blue-400 text-xs mt-6">Source : Analyse interne — moyenne de nos clients avant onboarding</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MÉTHODE ── */}
      <section id="methode" className="py-24 relative" style={{ background: '#060e1f', ...gridStyle }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 border border-blue-500/40 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              LA MÉTHODE
            </div>
            <h2 className="text-5xl font-black mb-4">
              LE SYSTÈME <span className="text-blue-400">S.C.A.L.E.</span>™
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Transformez un flux de leads en rendez-vous qualifiés grâce à une machine humaine structurée.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: '01', icon: <Target className="w-6 h-6" />, label: 'SOURCER',
                title: 'Génération de leads ciblée',
                desc: "Importez vos leads ou laissez-nous les générer via SEO, publicités et prospection manuelle. Chaque lead est scoré avant traitement.",
                points: ['Import CSV / CRM', 'Scoring automatique', 'Segmentation par secteur'],
                color: 'from-blue-600 to-blue-800'
              },
              {
                num: '02', icon: <Phone className="w-6 h-6" />, label: 'CONTACTER',
                title: 'Multi-canal en moins de 5 min',
                desc: "Nos agents contactent chaque lead dans les 5 minutes : appel, WhatsApp, email. Relances automatiques sur 7 jours.",
                points: ['80–120 appels/agent/jour', 'WhatsApp + Email', 'Relances J+1, J+3, J+7'],
                color: 'from-purple-600 to-purple-800',
                badge: 'PILIER CENTRAL'
              },
              {
                num: '03', icon: <CheckCircle2 className="w-6 h-6" />, label: 'CLOSER',
                title: 'Qualification & prise de RDV',
                desc: "Chaque prospect est qualifié selon vos critères. Seuls les RDV chauds arrivent dans votre agenda.",
                points: ['Script de qualification custom', 'RDV sur votre agenda', "Suivi jusqu'au signing"],
                color: 'from-cyan-600 to-cyan-800'
              },
            ].map(({ num, icon, label, title, desc, points, color, badge }) => (
              <div key={num} className="relative bg-[#0d1f4a] rounded-2xl p-6 border border-blue-900 hover:border-blue-500/50 transition-colors">
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    {badge}
                  </div>
                )}
                <div className="text-6xl font-black text-white/5 absolute top-4 right-4 leading-none">{num}</div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                  {icon}
                </div>
                <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-2">{label}</div>
                <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                <p className="text-blue-200 text-sm mb-4 leading-relaxed">{desc}</p>
                <ul className="space-y-1.5">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-blue-300">
                      <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section id="processus" className="py-24 bg-[#07111f]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 border border-blue-500/40 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              PARCOURS
            </div>
            <h2 className="text-4xl font-black mb-4">
              DE ZÉRO À PIPELINE PLEIN<br />
              <span className="text-blue-400">EN 30 JOURS.</span>
            </h2>
            <p className="text-blue-200">Un processus structuré, chaque étape a un objectif précis.</p>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600 via-blue-500 to-transparent" />
            <div className="space-y-0">
              {[
                { num: '01', week: 'J 1–3', title: 'ONBOARDING & CONFIGURATION', desc: "Brief complet de votre offre. Script de qualification validé ensemble. Accès au CRM ScaleWithMike configuré à vos couleurs.", tag: 'Configuration' },
                { num: '02', week: 'J 3–7', title: 'FORMATION DE L\'ÉQUIPE', desc: "Vos 5 agents formés à votre pitch, vos personas et vos objections. Tests d'appel enregistrés et validés.", tag: 'Formation' },
                { num: '03', week: 'J 7–14', title: 'PREMIER BATCH DE LEADS', desc: "Premier lot de leads traités. Appels, relances WhatsApp et emails envoyés. Premiers RDV planifiés.", tag: 'Lancement' },
                { num: '04', week: 'J 14–21', title: 'OPTIMISATION SCRIPTS', desc: "Analyse des 100 premiers appels. A/B test de 2 scripts. Identification des objections clés et réponses optimisées.", tag: 'Optimisation' },
                { num: '05', week: 'J 21–30', title: 'MONTÉE EN RÉGIME', desc: "Volume doublé. Segmentation affinée. Reporting hebdomadaire envoyé. Flux de RDV constant établi.", tag: 'Scale' },
                { num: '06', week: 'M 3+', title: 'MACHINE COMMERCIALE', desc: "Flux constant de 30–60 RDV qualifiés par mois par agent. KPIs stabilisés. Scaling possible sous 48h.", tag: 'Résultats' },
              ].map(({ num, week, title, desc, tag }) => (
                <div key={num} className="relative flex gap-8 pb-10 pl-14 last:pb-0">
                  {/* Circle on timeline */}
                  <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-[#0d1f4a] border-2 border-blue-500 flex items-center justify-center text-blue-400 font-black text-sm flex-shrink-0">
                    {num}
                  </div>
                  <div className="flex-1 bg-[#0d1f4a] rounded-xl p-5 border border-blue-900 hover:border-blue-500/40 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="text-blue-500 text-xs font-bold">{week} — </span>
                        <span className="text-white font-bold">{title}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold whitespace-nowrap">{tag}</span>
                    </div>
                    <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RÉSULTATS / KPIs TABLE ── */}
      <section id="resultats" className="py-24" style={{ background: '#060e1f', ...gridStyle }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 border border-blue-500/40 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              PERFORMANCES
            </div>
            <h2 className="text-4xl font-black mb-4">
              LES <span className="text-blue-400">5 MÉTRIQUES</span> QUI CHANGENT TOUT.
            </h2>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { val: '80–120', label: 'Appels / agent / jour', icon: <Phone className="w-5 h-5" />, color: 'text-blue-400' },
              { val: '35%', label: 'Taux de contact moyen', icon: <Target className="w-5 h-5" />, color: 'text-cyan-400' },
              { val: '8–15', label: 'RDV / agent / semaine', icon: <Calendar className="w-5 h-5" />, color: 'text-purple-400' },
              { val: '+35%', label: 'Taux de conversion', icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-400' },
            ].map(({ val, label, icon, color }) => (
              <div key={label} className="bg-[#0d1f4a] rounded-xl p-5 border border-blue-900 text-center">
                <div className={`flex justify-center mb-2 ${color}`}>{icon}</div>
                <div className={`text-3xl font-black ${color} mb-1`}>{val}</div>
                <div className="text-blue-300 text-xs">{label}</div>
              </div>
            ))}
          </div>

          {/* Table des piliers */}
          <div className="bg-[#0d1f4a] rounded-2xl border border-blue-900 overflow-hidden">
            <div className="px-6 py-4 border-b border-blue-900 flex items-center justify-between">
              <h3 className="font-bold text-white">LES 6 PILIERS DU SCALE CALL CENTER</h3>
              <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded font-bold">1 RAPPORT HEBDO</div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-900">
                  <th className="text-left px-6 py-3 text-blue-400 text-xs uppercase tracking-widest">#</th>
                  <th className="text-left px-4 py-3 text-blue-400 text-xs uppercase tracking-widest">Pilier</th>
                  <th className="text-left px-4 py-3 text-blue-400 text-xs uppercase tracking-widest hidden md:table-cell">Objectif</th>
                  <th className="text-left px-4 py-3 text-blue-400 text-xs uppercase tracking-widest">Résultat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { num: '01', pilier: 'Sourcing', obj: 'Leads qualifiés en flux continu', result: 'Pipeline toujours plein' },
                  { num: '02', pilier: 'Contact', obj: 'Réponse en moins de 5 minutes', result: 'Taux de contact x3' },
                  { num: '03', pilier: 'Qualification', obj: 'Identifier les besoins réels', result: 'RDV chauds uniquement' },
                  { num: '04', pilier: 'Relance', obj: 'Séquence sur 7 jours', result: 'Zéro lead oublié' },
                  { num: '05', pilier: 'Reporting', obj: 'KPIs en temps réel', result: 'Décisions basées sur data' },
                  { num: '06', pilier: 'Optimisation', obj: 'A/B test scripts continus', result: 'Amélioration constante' },
                ].map(({ num, pilier, obj, result }, i) => (
                  <tr key={num} className={`border-b border-blue-900/50 hover:bg-blue-500/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-6 py-4 text-blue-500 font-bold text-sm">{num}</td>
                    <td className="px-4 py-4 text-white font-bold text-sm">{pilier}</td>
                    <td className="px-4 py-4 text-blue-200 text-sm hidden md:table-cell">{obj}</td>
                    <td className="px-4 py-4 text-green-400 text-sm font-medium">{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ARTICLES SEO ── */}
      <section id="articles" className="py-24 bg-[#07111f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">RESSOURCES GRATUITES</div>
              <h2 className="text-4xl font-black">GUIDES & STRATÉGIES<br /><span className="text-blue-400">CALL CENTER B2B</span></h2>
            </div>
            <Link href="/articles" className="hidden md:flex items-center gap-2 text-blue-400 hover:text-white text-sm font-bold transition-colors">
              Voir tous les guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { cat: 'PROSPECTION & SCRIPTS', catColor: 'text-blue-400 border-blue-500/40', title: 'Script de téléprospection B2B : le guide complet 2026', desc: 'Comment construire un script qui passe les secrétaires, engage le décideur et décroche le RDV en moins de 3 minutes.', read: '8 min', tags: ['Script', 'Closing'] },
              { cat: 'MANAGEMENT CALL CENTER', catColor: 'text-purple-400 border-purple-500/40', title: 'KPIs call center : les 12 métriques que tout manager doit suivre', desc: "Taux de contact, durée d'appel, RDV/agent, coût par lead — quoi mesurer et comment optimiser chaque indicateur.", read: '10 min', tags: ['KPIs', 'Management'] },
              { cat: 'GÉNÉRATION DE LEADS', catColor: 'text-cyan-400 border-cyan-500/40', title: 'Combiner SEO, Ads et cold calling pour un pipeline inarrêtable', desc: 'La stratégie multi-canal pour générer 100+ leads qualifiés par mois sans dépendre d\'une seule source.', read: '11 min', tags: ['SEO', 'Leads'] },
              { cat: 'OPTIMISATION', catColor: 'text-green-400 border-green-500/40', title: 'A/B testing de scripts : méthode pour doubler votre taux de RDV', desc: 'Framework complet pour tester, mesurer et itérer sur vos scripts d\'appel et augmenter votre taux de conversion.', read: '7 min', tags: ['Test', 'Conversion'] },
              { cat: 'RECRUTEMENT', catColor: 'text-orange-400 border-orange-500/40', title: 'Recruter et former un agent call center performant en 2 semaines', desc: "Profil idéal, process d'onboarding, évaluation des premières semaines — tout le playbook RH d'une équipe qui performe.", read: '9 min', tags: ['RH', 'Formation'] },
              { cat: 'WHATSAPP & EMAIL', catColor: 'text-pink-400 border-pink-500/40', title: 'Templates WhatsApp B2B : 15 messages qui décrochent des réponses', desc: 'Les messages de prospection WhatsApp les plus efficaces, testés sur des milliers d\'envois, avec taux de réponse réels.', read: '6 min', tags: ['WhatsApp', 'Templates'] },
            ].map(({ cat, catColor, title, desc, read, tags }) => (
              <Link href="/articles" key={title} className="group bg-[#0d1f4a] rounded-xl border border-blue-900 hover:border-blue-500/50 transition-all overflow-hidden cursor-pointer block">
                <div className="p-5">
                  <div className={`inline-block text-xs font-bold tracking-widest uppercase px-2 py-1 rounded border ${catColor} bg-white/5 mb-4`}>
                    {cat}
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug mb-3 group-hover:text-blue-300 transition-colors">
                    {title}
                  </h3>
                  <p className="text-blue-300 text-xs leading-relaxed mb-4">{desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded bg-white/5 text-blue-400">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-blue-400 text-xs">
                      <span>{read} de lecture</span>
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFRE ── */}
      <section className="py-24" style={{ background: '#060e1f', ...gridStyle }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 border border-blue-500/40 text-blue-400 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              TARIFICATION
            </div>
            <h2 className="text-4xl font-black mb-4">
              UNE OFFRE SIMPLE.<br /><span className="text-blue-400">DES RÉSULTATS CLAIRS.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter', price: '800€', sub: '/agent/mois', min: '5 agents min.',
                features: ['Pipeline Kanban illimité', 'Scripts fournis & optimisés', 'Reporting hebdomadaire', 'WhatsApp + Email templates', '1 responsable inclus'],
                cta: 'Démarrer', highlight: false
              },
              {
                name: 'Growth', price: '850€', sub: '/agent/mois', min: '10 agents min.',
                features: ['Tout du plan Starter', 'Séquences relance auto', 'A/B testing scripts', 'Analytics avancés', 'Scoring IA des leads', 'Call recording & review'],
                cta: 'Choisir Growth', highlight: true, badge: 'POPULAIRE'
              },
              {
                name: 'Scale', price: 'Sur devis', sub: '20+ agents', min: 'Contrat annuel',
                features: ['Tout du plan Growth', 'Équipe dédiée multi-secteur', 'Intégration CRM custom', 'API webhook', 'Account manager dédié', 'SLA garanti'],
                cta: 'Nous contacter', highlight: false
              },
            ].map(({ name, price, sub, min, features, cta, highlight, badge }) => (
              <div key={name} className={`relative rounded-2xl p-6 border ${highlight ? 'bg-gradient-to-b from-blue-600 to-blue-900 border-blue-400' : 'bg-[#0d1f4a] border-blue-900'}`}>
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-blue-900 text-xs font-black rounded-full">
                    {badge}
                  </div>
                )}
                <div className="mb-4">
                  <div className="text-blue-300 text-sm font-bold">{name}</div>
                  <div className="text-3xl font-black text-white mt-1">{price}</div>
                  <div className={`text-sm ${highlight ? 'text-blue-200' : 'text-blue-400'}`}>{sub}</div>
                  <div className="text-xs text-blue-400 mt-1">{min}</div>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${highlight ? 'text-blue-100' : 'text-blue-200'}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-yellow-300' : 'text-green-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block w-full py-3 rounded-lg text-center text-sm font-bold transition-all ${highlight ? 'bg-white text-blue-700 hover:bg-blue-50' : 'border border-blue-500 text-blue-300 hover:bg-blue-500/20'}`}>
                  {cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-blue-400 text-sm mt-6">Engagement minimum 3 mois • Démarrage sous 7 jours • Équipe 100% francophone</p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section id="contact" className="py-24 bg-[#07111f]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4">
              ET SI EN 30 JOURS,<br />
              <span className="text-blue-400">VOTRE PIPELINE ÉTAIT PLEIN ?</span>
            </h2>
            <p className="text-blue-200 text-lg max-w-xl mx-auto">
              ScaleWithMike, c'est le service qui transforme vos leads en rendez-vous qualifiés grâce à une équipe call center dédiée, structurée et pilotée par des experts.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <LeadForm variant="cta" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-blue-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" />Sans engagement au-delà de 3 mois</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" />Démarrage en 7 jours</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" />Équipe 100% francophone</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-10 bg-[#060e1f]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-blue-400">
          <div className="font-black text-white text-lg">
            <span className="text-yellow-400">⚡</span> ScaleWithMike
          </div>
          <div className="flex gap-6">
            <a href="#methode" className="hover:text-white transition-colors">La Méthode</a>
            <a href="#processus" className="hover:text-white transition-colors">Processus</a>
            <a href="#articles" className="hover:text-white transition-colors">Ressources</a>
            <Link href="/dashboard" className="hover:text-white transition-colors">CRM</Link>
          </div>
          <div className="text-blue-500 text-xs">m.simono@groupe-fc.com • © 2026 ScaleWithMike</div>
        </div>
      </footer>

    </div>
  )
}
