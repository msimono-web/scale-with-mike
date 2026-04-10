'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, CheckCircle2, ArrowRight, ChevronDown, Star, Zap } from 'lucide-react'

// ─── FORM ─────────────────────────────────────────────────────────────────────
function DiagForm({ dark = false }: { dark?: boolean }) {
  const [sent, setSent] = useState(false)
  if (sent) return (
    <div className="rounded-2xl p-8 text-center bg-white border border-slate-200 shadow-xl">
      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
      <p className="font-black text-slate-900 text-lg">Demande reçue !</p>
      <p className="text-slate-500 text-sm mt-1">On vous rappelle sous 24h.</p>
    </div>
  )
  return (
    <div className="bg-white rounded-2xl p-7 shadow-2xl border border-slate-100">
      <div className="mb-5">
        <p className="font-black text-slate-900 text-base uppercase tracking-widest text-center mb-1">Recevoir un diagnostic gratuit</p>
        <p className="text-slate-400 text-xs text-center">Réponse immédiate · Sans engagement · 100% gratuit</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input placeholder="Prénom" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
          <input placeholder="Email" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
        </div>
        <input placeholder="Téléphone / WhatsApp" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
        <button onClick={() => setSent(true)}
          className="w-full py-4 font-black rounded-xl transition-all text-sm tracking-widest uppercase shadow-lg hover:opacity-90"
          style={{ background: '#0a1aff', color: '#fde68a' }}>
          Recevoir mon diagnostic gratuit →
        </button>
        <button onClick={() => setSent(true)} className="w-full py-3 border border-slate-200 text-slate-600 text-sm rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-semibold">
          <Phone className="w-4 h-4 text-blue-600" /> On vous rappelle directement
        </button>
      </div>
      <div className="flex justify-center gap-4 mt-4 text-xs text-slate-400">
        {['🔒 Données sécurisées', '⚡ Réponse < 24h', '✓ Sans engagement'].map(t => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}

// ─── PIPELINE ─────────────────────────────────────────────────────────────────
function Pipeline() {
  const steps = [
    { label: 'LEADS', sub: 'Générés ou importés', bg: 'bg-blue-900 border-blue-700' },
    { label: 'CONTACT', sub: '< 5 minutes', bg: 'bg-blue-800 border-blue-600' },
    { label: 'RELANCES', sub: 'J+1 · J+3 · J+7', bg: 'bg-blue-700 border-blue-500' },
    { label: 'QUALI.', sub: 'Scoring & tri', bg: 'bg-indigo-700 border-indigo-500' },
    { label: 'RDV', sub: 'Dans votre agenda', bg: 'bg-green-700 border-green-500' },
  ]
  return (
    <div className="flex items-center gap-0">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center flex-1 last:flex-none">
          <div className={`flex-1 ${s.bg} border rounded-xl py-4 px-3 text-center`}>
            <div className="text-white font-black text-xs tracking-widest">{s.label}</div>
            <div className="text-blue-300 text-xs mt-0.5">{s.sub}</div>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mx-1" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* ─── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#050b2e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-base">⚡</div>
            <span className="font-black text-white text-lg tracking-tight">
              Scale<span className="text-yellow-300">With</span>Mike
            </span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[['#comment', 'Méthode'], ['#offre', "L'offre"], ['#resultats', 'Résultats'], ['#pricing', 'Tarifs']].map(([href, label]) => (
              <a key={href} href={href} className="text-xs font-black tracking-widest uppercase text-white/70 hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>
          {/* CTA */}
          <a href="#contact"
            className="flex items-center gap-2 px-5 py-2.5 font-black text-xs tracking-widest uppercase rounded-xl transition-all shadow-lg"
            style={{ background: '#fde68a', color: '#0a1aff' }}>
            <Phone className="w-3.5 h-3.5" /> Diagnostic gratuit
          </a>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #050b2e 0%, #071244 40%, #091a6a 100%)' }}>

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Blue glow bottom left */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(10,26,255,0.35), transparent 70%)' }} />
        {/* Accent glow top right */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.12), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 py-16 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-8 border"
                style={{ background: 'rgba(10,26,255,0.3)', borderColor: 'rgba(10,26,255,0.6)', color: '#93c5fd' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Call Center B2B · 100% Francophone
              </div>

              {/* HEADLINE */}
              <h1 className="font-black leading-[1.0] uppercase mb-6 text-white"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
                On génère<br />
                <span style={{ color: '#fde68a' }}>vos leads</span><br />
                et les transforme<br />
                en <span style={{ color: '#34d399' }}>RDV.</span>
              </h1>

              <p className="text-white/75 text-lg mb-8 leading-relaxed max-w-md">
                Une équipe dédiée prospecte pour vous, contacte sous 5 minutes
                et pose des RDV qualifiés directement dans votre agenda.
              </p>

              {/* 3 bullets */}
              <div className="flex flex-col gap-3 mb-10">
                {[
                  { icon: '⚡', text: 'Génération de leads incluse à partir du plan Growth' },
                  { icon: '📞', text: 'Contact en moins de 5 minutes · Relances sur 7 jours' },
                  { icon: '✅', text: 'Uniquement des RDV qualifiés selon vos critères' },
                ].map(b => (
                  <div key={b.text} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="text-base leading-none">{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                {[
                  { val: '+200', lbl: 'RDV / mois', c: '#fde68a' },
                  { val: '< 5 min', lbl: 'Temps de contact', c: '#34d399' },
                  { val: '7 jours', lbl: 'Pour démarrer', c: '#93c5fd' },
                ].map(({ val, lbl, c }) => (
                  <div key={lbl}>
                    <div className="text-2xl font-black" style={{ color: c }}>{val}</div>
                    <div className="text-white/50 text-xs mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Form */}
            <div>
              <DiagForm />
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ─── BANDEAU SECTEURS ─────────────────────────────────────────────── */}
      <div className="bg-slate-900 border-y border-slate-800 py-4">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-6 items-center text-slate-400 text-sm">
          <span className="text-slate-600 text-xs uppercase tracking-widest font-semibold">Secteurs actifs :</span>
          {['Industrie & BTP', 'Services B2B', 'Immobilier', 'Tech / SaaS', 'Formation Pro'].map(s => (
            <span key={s} className="font-medium text-slate-300">{s}</span>
          ))}
        </div>
      </div>

      {/* ─── PROBLÈME ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">Le problème</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Vous avez du trafic.<br />Mais pas assez de RDV.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '📞', title: 'Leads jamais rappelés', desc: 'Un lead non contacté sous 5 minutes a 80% de chances d\'être perdu. La plupart ne sont jamais rappelés.' },
              { icon: '🔄', title: "Relances qui tombent à l'eau", desc: "Vos commerciaux ont autre chose à faire. Les relances sont oubliées. Des contrats vous échappent chaque semaine." },
              { icon: '😓', title: 'Commerciaux qui prospectent au lieu de closer', desc: 'Ils passent 60% de leur temps à qualifier des leads froids. C\'est du CA perdu directement.' },
              { icon: '💸', title: 'Budget marketing gaspillé', desc: 'Vous payez pour générer des leads que personne ne traite correctement. Le problème est dans le suivi, pas la génération.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <span className="text-3xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-black text-slate-900 mb-1 text-[15px]">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OFFRE / SOLUTION ────────────────────────────────────────────── */}
      <section id="comment" className="py-20" style={{ background: 'linear-gradient(150deg, #050b2e 0%, #071244 50%, #091a6a 100%)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-5 border" style={{ background: 'rgba(10,26,255,0.3)', borderColor: 'rgba(10,26,255,0.6)', color: '#93c5fd' }}>La solution</div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              On s&apos;occupe de tout.<br />
              <span style={{ color: '#fde68a' }}>De A à Z.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              On génère vos leads, on les contacte et on vous envoie uniquement des RDV qualifiés.
            </p>
          </div>

          {/* 3 étapes */}
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { num: '01', title: 'On génère vos leads', desc: 'Prospection ciblée via appels sortants, SEO et publicités. Ou on traite vos leads existants. À vous de choisir.', badge: null, color: 'bg-white/10 border-white/20' },
              { num: '02', title: 'On contacte rapidement', desc: 'Chaque lead est appelé sous 5 minutes. WhatsApp + email en parallèle. Relances automatiques sur 7 jours.', badge: 'PILIER CENTRAL', color: 'bg-white/15 border-white/30' },
              { num: '03', title: 'On vous envoie les RDV', desc: "Seulement les prospects qui matchent vos critères. RDV posé dans votre agenda. Vous n'avez plus qu'à closer.", badge: null, color: 'bg-white/10 border-white/20' },
            ].map(({ num, title, desc, badge, color }) => (
              <div key={num} className={`relative rounded-2xl p-6 border ${color} backdrop-blur-sm`}>
                {badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded-full whitespace-nowrap">{badge}</div>}
                <div className="text-6xl font-black text-white/8 leading-none mb-4 select-none">{num}</div>
                <h3 className="text-white font-black text-lg mb-2">{title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
            <p className="text-blue-300 text-xs font-black tracking-widest uppercase mb-5 text-center">PIPELINE VISUEL</p>
            <Pipeline />
          </div>
        </div>
      </section>

      {/* ─── PROCESSUS RAPIDE ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">Démarrage</p>
            <h2 className="text-4xl font-black text-slate-900">Opérationnel en 7 jours.</h2>
          </div>
          <div className="space-y-3">
            {[
              { tag: 'J 1–3', color: 'bg-blue-600', title: 'Setup', desc: 'Brief de votre offre · Validation du script · Intégration CRM · Équipe configurée.' },
              { tag: 'J 4–7', color: 'bg-indigo-600', title: 'Lancement', desc: 'Premiers appels envoyés · Premiers leads traités · Premiers RDV dans votre agenda.' },
              { tag: 'Semaine 2+', color: 'bg-green-600', title: 'Optimisation', desc: 'A/B test des scripts · Analyse des KPIs · Le flux s\'améliore chaque semaine.' },
            ].map(({ tag, color, title, desc }) => (
              <div key={tag} className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors">
                <div className={`${color} text-white text-xs font-black px-3 py-2 rounded-xl whitespace-nowrap flex-shrink-0 min-w-[80px] text-center`}>{tag}</div>
                <div>
                  <span className="font-black text-slate-900">{title} — </span>
                  <span className="text-slate-500 text-sm">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RÉSULTATS ────────────────────────────────────────────────────── */}
      <section id="resultats" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">Résultats</p>
            <h2 className="text-4xl font-black text-slate-900">Ce que ça donne, concrètement.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { sector: 'Services B2B', result: '520 leads → 94 RDV', detail: '6 agents · 3 mois · 17 contrats signés', color: 'border-t-yellow-400' },
              { sector: 'Industrie', result: '380 leads → 61 RDV', detail: '5 agents · 3 mois · 11 contrats signés', color: 'border-t-blue-500' },
              { sector: 'Formation Pro', result: '290 leads → 53 RDV', detail: '5 agents · 3 mois · 21 inscrits', color: 'border-t-green-500' },
            ].map(({ sector, result, detail, color }) => (
              <div key={sector} className={`bg-white rounded-2xl p-6 border border-slate-200 border-t-4 ${color} shadow-sm`}>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{sector}</p>
                <p className="text-2xl font-black text-slate-900 mb-2">{result}</p>
                <p className="text-slate-500 text-sm">{detail}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            <span className="text-slate-400 text-sm ml-2">Recommandé par nos clients</span>
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-4">
            <p className="text-blue-600 text-xs font-black tracking-widest uppercase mb-3">Tarifs</p>
            <h2 className="text-4xl font-black text-slate-900">
              Plus vous scalez, moins c'est cher.<br />
              <span className="text-blue-600">Et on génère vos leads.</span>
            </h2>
          </div>
          <p className="text-center text-slate-500 mb-10 max-w-xl mx-auto">À partir du plan Growth, notre équipe prospecte activement pour vous — vous n'avez plus à fournir les leads.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-5">
            {[
              {
                name: 'STARTER', price: '900€', unit: '/agent/mois', agents: '3 agents min.', total: '= 2 700€ / mois',
                badge: null, highlight: false,
                generation: false,
                perks: ['Traitement de vos leads', 'Scripts fournis & optimisés', 'Reporting hebdomadaire', 'WhatsApp + Email inclus', '1 responsable inclus', 'Intégration CRM incluse'],
              },
              {
                name: 'GROWTH', price: '850€', unit: '/agent/mois', agents: '5 agents min.', total: '= 4 250€ / mois',
                badge: 'POPULAIRE', highlight: true,
                generation: true,
                perks: ['Tout Starter', '✦ Génération de leads incluse', 'Relances automatiques', 'A/B testing scripts', 'Analytics avancés', 'Call recording & review'],
              },
              {
                name: 'SCALE', price: '800€', unit: '/agent/mois', agents: '10 agents+', total: '= dès 8 000€ / mois',
                badge: null, highlight: false,
                generation: true,
                perks: ['Tout Growth', '✦ Génération leads volume+', 'Équipe dédiée multi-secteur', 'Intégration CRM custom', 'Account manager dédié', 'SLA & reporting sur mesure'],
              },
            ].map(({ name, price, unit, agents, total, badge, highlight, generation, perks }) => (
              <div key={name} className={`relative rounded-2xl border overflow-hidden ${highlight ? 'shadow-2xl shadow-blue-200 border-blue-500' : 'border-slate-200 shadow-sm'}`}>
                {/* Top color bar */}
                <div className={`h-1.5 w-full ${highlight ? 'bg-blue-600' : 'bg-slate-200'}`} />
                {badge && <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded-full">{badge}</div>}

                <div className={`p-6 ${highlight ? 'bg-white' : 'bg-white'}`}>
                  {/* Generation badge */}
                  {generation && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-green-700 text-xs font-bold mb-4">
                      <Zap className="w-3 h-3" /> Génération de leads incluse
                    </div>
                  )}
                  {!generation && <div className="h-7 mb-4" />}

                  <div className={`text-sm font-black tracking-widest uppercase mb-2 ${highlight ? 'text-blue-600' : 'text-slate-400'}`}>{name}</div>
                  <div className="flex items-end gap-1 mb-0.5">
                    <span className="text-5xl font-black text-slate-900">{price}</span>
                    <span className="text-slate-400 text-sm pb-2">{unit}</span>
                  </div>
                  <div className="text-slate-400 text-xs mb-1">{agents}</div>
                  <div className={`text-sm font-bold mb-5 ${highlight ? 'text-blue-700' : 'text-slate-700'}`}>{total}</div>

                  <ul className="space-y-2.5 mb-6">
                    {perks.map(p => (
                      <li key={p} className={`flex items-start gap-2 text-sm ${p.startsWith('✦') ? 'text-green-700 font-bold' : 'text-slate-600'}`}>
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.startsWith('✦') ? 'text-green-500' : highlight ? 'text-blue-500' : 'text-slate-300'}`} />
                        {p.replace('✦ ', '')}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={`block w-full py-3.5 rounded-xl text-sm font-black text-center uppercase tracking-widest transition-all ${highlight ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-900 text-white hover:bg-slate-700'}`}>
                    {highlight ? 'Choisir Growth' : name === 'STARTER' ? 'Démarrer' : 'Nous contacter'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl px-5 py-4 bg-blue-50 border border-blue-100 text-sm text-blue-800 text-center">
            💡 <strong>Logiciel téléphonique à la charge du client.</strong> Intégration CRM incluse dans tous les plans. Engagement minimum 3 mois.
          </div>

        </div>
      </section>

      {/* ─── DASHBOARD UPSELL ─────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/15 border border-cyan-500/25 rounded-full text-cyan-400 text-xs font-black tracking-widest uppercase mb-6">
              <Zap className="w-3 h-3" /> Option complémentaire — +200€/mois
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-4">
              Ne perdez plus<br />
              <span className="text-cyan-400">aucun lead.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Un dashboard CRM pensé pour les équipes call center. Chaque lead tracké, chaque agent suivi, chaque euro mesuré.
            </p>
          </div>

          {/* 4 avantages */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {[
              { icon: '🎯', title: 'Zéro lead perdu', desc: 'Chaque contact est loggé automatiquement. Aucun lead ne tombe dans le vide.' },
              { icon: '📊', title: 'Pipeline visuel', desc: 'Vue kanban en temps réel. Voyez où en est chaque prospect en un coup d\'oeil.' },
              { icon: '⚡', title: 'Productivité maximale', desc: 'Vos agents savent exactement quoi faire à chaque instant. Fini le chaos.' },
              { icon: '💰', title: 'ROI transparent', desc: 'Coût par RDV, taux de contact, CA généré. Chaque euro est visible et justifié.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-5 border border-slate-800 bg-slate-900 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all group">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-black text-white mb-2 text-[15px] group-hover:text-cyan-400 transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Mockup pipeline CRM */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden mb-10">
            {/* Topbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-slate-500 text-xs font-mono">ScaleWithMike · CRM Pipeline</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Live
              </div>
            </div>
            {/* Kanban columns */}
            <div className="p-5 overflow-x-auto">
              <div className="flex gap-4 min-w-[700px]">
                {[
                  { label: 'NOUVEAUX LEADS', color: 'border-blue-500/50 bg-blue-500/5', dot: 'bg-blue-400', count: 12, cards: [
                    { name: 'Thomas M.', co: 'BTP Rhône', tag: 'Chaud', tagC: 'bg-orange-500/20 text-orange-400' },
                    { name: 'Sarah L.', co: 'SaaS Paris', tag: 'Nouveau', tagC: 'bg-blue-500/20 text-blue-400' },
                    { name: 'Marc D.', co: 'Immo Lyon', tag: 'Urgent', tagC: 'bg-red-500/20 text-red-400' },
                  ]},
                  { label: 'EN CONTACT', color: 'border-yellow-500/50 bg-yellow-500/5', dot: 'bg-yellow-400', count: 8, cards: [
                    { name: 'Julie R.', co: 'Formation Pro', tag: 'Rappel J+1', tagC: 'bg-yellow-500/20 text-yellow-400' },
                    { name: 'Pierre V.', co: 'Industrie Est', tag: 'Envoyé', tagC: 'bg-slate-500/20 text-slate-400' },
                  ]},
                  { label: 'QUALIFICATION', color: 'border-purple-500/50 bg-purple-500/5', dot: 'bg-purple-400', count: 5, cards: [
                    { name: 'Anna K.', co: 'Tech B2B', tag: 'Score 8/10', tagC: 'bg-purple-500/20 text-purple-400' },
                    { name: 'Romain C.', co: 'Services', tag: 'En cours', tagC: 'bg-slate-500/20 text-slate-400' },
                  ]},
                  { label: 'RDV POSÉS', color: 'border-green-500/50 bg-green-500/5', dot: 'bg-green-400', count: 7, cards: [
                    { name: 'Léa B.', co: 'Retail Sud', tag: '✓ Confirmé', tagC: 'bg-green-500/20 text-green-400' },
                    { name: 'Hugo P.', co: 'Logistique', tag: '✓ Lundi 14h', tagC: 'bg-green-500/20 text-green-400' },
                  ]},
                ].map(col => (
                  <div key={col.label} className={`flex-1 rounded-xl border ${col.color} p-3`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{col.label}</span>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 rounded-full px-2 py-0.5 font-bold">{col.count}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {col.cards.map(card => (
                        <div key={card.name} className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-white text-xs font-bold leading-tight">{card.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${card.tagC}`}>{card.tag}</span>
                          </div>
                          <span className="text-slate-500 text-[10px]">{card.co}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Stats bar */}
            <div className="grid grid-cols-4 divide-x divide-slate-800 border-t border-slate-800">
              {[
                { val: '32', lbl: 'Leads actifs', c: 'text-white' },
                { val: '87%', lbl: 'Taux de contact', c: 'text-green-400' },
                { val: '7', lbl: 'RDV ce mois', c: 'text-cyan-400' },
                { val: '4.2€', lbl: 'Coût / RDV', c: 'text-yellow-400' },
              ].map(s => (
                <div key={s.lbl} className="py-3 text-center">
                  <div className={`text-lg font-black ${s.c}`}>{s.val}</div>
                  <div className="text-slate-600 text-[10px] mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="text-4xl font-black text-white">+200€<span className="text-slate-500 text-lg font-normal">/mois</span></div>
              <a href="#contact"
                className="flex items-center gap-2 px-8 py-4 font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg"
                style={{ background: '#06b6d4', color: '#fff' }}>
                <Zap className="w-4 h-4" /> Activer mon dashboard CRM
              </a>
              <p className="text-slate-600 text-xs">Intégré à votre plan · Déploiement en 24h</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────────────────────────────── */}
      <section id="contact" className="py-24" style={{ background: 'linear-gradient(150deg, #050b2e 0%, #071244 50%, #091a6a 100%)' }}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-4 leading-tight">
            Prêt à remplir<br />votre agenda ?
          </h2>
          <p className="text-blue-200 mb-8">
            Sans engagement. Diagnostic gratuit. On vous rappelle sous 24h.
          </p>
          <DiagForm />
          <div className="flex flex-wrap justify-center gap-5 mt-6 text-xs text-blue-300">
            {['Sans engagement', 'Démarrage en 7 jours', 'Équipe 100% francophone'].map(g => (
              <span key={g} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" />{g}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <div className="font-black text-slate-900">⚡ ScaleWithMike</div>
          <div className="flex gap-6">
            <a href="#comment" className="hover:text-blue-600 transition-colors">Méthode</a>
            <a href="#resultats" className="hover:text-blue-600 transition-colors">Résultats</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Tarifs</a>
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">CRM</Link>
          </div>
          <div className="text-xs">m.simono@groupe-fc.com · © 2026</div>
        </div>
      </footer>
    </div>
  )
}
