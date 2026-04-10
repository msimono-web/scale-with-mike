'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, CheckCircle2, ArrowRight, ChevronDown, Star } from 'lucide-react'

// ─── FORM ─────────────────────────────────────────────────────────────────────
function DiagForm({ dark = false }: { dark?: boolean }) {
  const [sent, setSent] = useState(false)
  if (sent) return (
    <div className={`rounded-2xl p-8 text-center ${dark ? 'bg-white/10 border border-white/20' : 'bg-green-50 border border-green-200'}`}>
      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
      <p className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Demande reçue.</p>
      <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>On vous rappelle sous 24h.</p>
    </div>
  )
  const inp = dark
    ? "flex-1 bg-white/10 border border-white/20 hover:border-white/40 rounded-xl px-4 py-3 text-white placeholder-slate-400 text-sm outline-none transition-colors"
    : "flex-1 bg-white border border-slate-200 hover:border-blue-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-colors shadow-sm"
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <input placeholder="Prénom" className={inp} />
        <input placeholder="Email professionnel" className={inp} />
      </div>
      <input placeholder="Téléphone / WhatsApp" className={`${inp} w-full`} />
      <button onClick={() => setSent(true)} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-blue-600/30">
        Recevoir un diagnostic gratuit →
      </button>
      <button onClick={() => setSent(true)} className={`w-full py-2.5 text-sm flex items-center justify-center gap-2 rounded-xl border transition-all ${dark ? 'border-white/15 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
        <Phone className="w-4 h-4" /> On vous rappelle directement
      </button>
    </div>
  )
}

// ─── PIPELINE VISUAL ──────────────────────────────────────────────────────────
function Pipeline() {
  const steps = [
    { label: 'Leads', sub: 'entrants', color: 'bg-slate-800', border: 'border-slate-700', dot: 'bg-slate-400' },
    { label: 'Contact', sub: '< 5 minutes', color: 'bg-blue-700', border: 'border-blue-600', dot: 'bg-blue-400' },
    { label: 'Relances', sub: 'J+1, J+3, J+7', color: 'bg-blue-600', border: 'border-blue-500', dot: 'bg-blue-300' },
    { label: 'Qualification', sub: 'Tri & scoring', color: 'bg-indigo-600', border: 'border-indigo-500', dot: 'bg-indigo-300' },
    { label: 'RDV', sub: 'Dans votre agenda', color: 'bg-green-600', border: 'border-green-500', dot: 'bg-green-400' },
  ]
  return (
    <div className="flex items-center justify-between gap-2 md:gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          <div className={`flex flex-col items-center text-center rounded-2xl px-3 py-4 border ${step.color} ${step.border} flex-shrink-0 w-full md:w-auto`}>
            <div className={`w-3 h-3 rounded-full ${step.dot} mb-2`} />
            <div className="text-white font-bold text-sm">{step.label}</div>
            <div className="text-white/60 text-xs mt-0.5">{step.sub}</div>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 flex items-center justify-center px-1">
              <ArrowRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="bg-white text-slate-800 font-sans overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-black text-lg text-white tracking-tight">
            ⚡ Scale<span className="text-blue-400">With</span>Mike
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#solution" className="hover:text-white transition-colors">Comment ça marche</a>
            <a href="#preuve" className="hover:text-white transition-colors">Résultats</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          </div>
          <a href="#contact" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all">
            Diagnostic gratuit
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 bg-slate-950 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        {/* Blue glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.18), transparent 70%)' }} />

        <div className="relative w-full max-w-5xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Call Center externalisé · 100% francophone · Opérationnel en 7 jours
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 text-white">
            On transforme vos leads<br />
            en <span className="text-blue-400">RDV qualifiés.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Une équipe dédiée contacte vos prospects, les qualifie et pose des rendez-vous directement dans votre agenda.
          </p>

          {/* 3 bullets */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              "Réponse en moins de 5 minutes",
              "Relances multi-canal automatiques",
              "Uniquement des RDV qualifiés",
            ].map(b => (
              <span key={b} className="flex items-center gap-2 text-sm text-white bg-white/8 border border-white/10 rounded-full px-4 py-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> {b}
              </span>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-xl mx-auto">
            <DiagForm dark />
            <p className="text-slate-600 text-xs mt-3">Sans engagement · Réponse sous 24h · 100% confidentiel</p>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">LE PROBLÈME</p>
            <h2 className="text-4xl font-black text-slate-900">Vous avez des leads.<br />Mais ils ne deviennent pas des clients.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: "📞", title: "Leads jamais rappelés", desc: "Un lead qui attend plus de 5 minutes a 80% de chances de ne jamais être converti. La plupart de vos leads ne sont jamais rappelés." },
              { icon: "🔄", title: "Relances oubliées", desc: "Vos commerciaux gèrent trop de choses à la fois. Les relances tombent à l'eau. Des RDV se perdent chaque semaine." },
              { icon: "😓", title: "Commerciaux débordés", desc: "Vos closers passent 60% de leur temps à prospecter au lieu de closer. C'est une perte directe de chiffre d'affaires." },
              { icon: "💸", title: "CA qui s'évapore", desc: "Chaque lead non traité = argent perdu. Si vous avez du trafic ou des leads, le problème n'est pas la génération — c'est le traitement." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">LA SOLUTION</p>
          <h2 className="text-4xl font-black text-white mb-4">Simple. En 3 étapes.</h2>
          <p className="text-slate-400 mb-14 max-w-xl mx-auto">On s'occupe de tout ce qui se passe entre le lead et le RDV.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { num: "01", title: "On reçoit vos leads", desc: "Import CSV, connexion CRM ou formulaire. On intègre vos leads dans notre système en quelques heures.", color: "border-slate-700 bg-slate-900" },
              { num: "02", title: "On contacte rapidement", desc: "Appel, WhatsApp, email — sous 5 minutes. Relances automatiques sur 7 jours si pas de réponse.", color: "border-blue-700 bg-blue-950" },
              { num: "03", title: "On vous envoie les RDV", desc: "Uniquement les prospects qualifiés selon vos critères. Le RDV est posé directement dans votre agenda.", color: "border-green-800 bg-green-950" },
            ].map(({ num, title, desc, color }) => (
              <div key={num} className={`rounded-2xl p-6 border ${color} text-left`}>
                <div className="text-5xl font-black text-white/10 mb-4 leading-none">{num}</div>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-6">PIPELINE VISUEL</p>
            <Pipeline />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">DÉMARRAGE</p>
            <h2 className="text-4xl font-black text-slate-900">Opérationnel en 7 jours.</h2>
          </div>
          <div className="space-y-4">
            {[
              { period: "J 1–3", title: "Setup & configuration", desc: "Brief de votre offre, validation du script, intégration CRM. Votre équipe est configurée.", color: "bg-blue-600" },
              { period: "J 4–7", title: "Lancement", desc: "Premiers appels envoyés. Premiers leads traités. Premiers RDV dans votre agenda.", color: "bg-indigo-600" },
              { period: "Semaine 2+", title: "Optimisation continue", desc: "A/B test des scripts, analyse des performances, ajustements. Le flux s'améliore chaque semaine.", color: "bg-green-600" },
            ].map(({ period, title, desc, color }) => (
              <div key={period} className="flex gap-5 items-start p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className={`${color} text-white text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap flex-shrink-0`}>{period}</div>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREUVE */}
      <section id="preuve" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">RÉSULTATS</p>
            <h2 className="text-4xl font-black text-slate-900">Ce que ça donne, concrètement.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { sector: "Services B2B", formula: "520 leads → 94 RDV", detail: "6 agents sur 3 mois. Taux de contact 34%. Dont 17 contrats signés.", color: "border-t-yellow-500" },
              { sector: "Industrie", formula: "380 leads → 61 RDV", detail: "5 agents sur 3 mois. Taux de contact 31%. 11 contrats signés.", color: "border-t-blue-500" },
              { sector: "Formation Pro", formula: "290 leads → 53 RDV", detail: "5 agents sur 3 mois. Taux de contact 36%. 21 inscrits.", color: "border-t-green-500" },
            ].map(({ sector, formula, detail, color }) => (
              <div key={sector} className={`bg-white rounded-2xl p-6 border border-slate-200 border-t-4 ${color} shadow-sm`}>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2">{sector}</p>
                <p className="text-xl font-black text-slate-900 mb-3">{formula}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <p className="text-center text-slate-500 text-sm">"Recommandé par nos clients actifs"</p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">TARIFS</p>
            <h2 className="text-4xl font-black text-slate-900">Simple. Plus vous scalez,<br /><span className="text-blue-600">moins c'est cher.</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-5">
            {[
              {
                name: "Starter", price: "900€", unit: "/agent/mois",
                agents: "3 agents min.", total: "= 2 700€ / mois",
                perks: ["Scripts fournis", "Reporting hebdo", "WhatsApp + Email", "1 responsable inclus"],
                cta: "Démarrer", highlight: false
              },
              {
                name: "Growth", price: "850€", unit: "/agent/mois",
                agents: "5 agents min.", total: "= 4 250€ / mois",
                perks: ["Tout Starter", "Relances auto", "A/B testing", "Analytics avancés", "Call recording"],
                cta: "Choisir Growth", highlight: true, badge: "POPULAIRE"
              },
              {
                name: "Scale", price: "800€", unit: "/agent/mois",
                agents: "10 agents+", total: "= dès 8 000€ / mois",
                perks: ["Tout Growth", "Équipe dédiée", "Intégration custom", "Account manager", "SLA garanti"],
                cta: "Nous contacter", highlight: false
              },
            ].map(({ name, price, unit, agents, total, perks, cta, highlight, badge }) => (
              <div key={name} className={`relative rounded-2xl p-6 border ${highlight ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                {badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded-full">{badge}</div>}
                <div className={`text-sm font-semibold mb-1 ${highlight ? 'text-blue-200' : 'text-slate-500'}`}>{name}</div>
                <div className="flex items-end gap-1 mb-0.5">
                  <span className={`text-4xl font-black ${highlight ? 'text-white' : 'text-slate-900'}`}>{price}</span>
                  <span className={`text-xs pb-1.5 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{unit}</span>
                </div>
                <div className={`text-xs mb-1 ${highlight ? 'text-blue-200' : 'text-slate-400'}`}>{agents}</div>
                <div className={`text-sm font-bold mb-5 ${highlight ? 'text-white' : 'text-slate-700'}`}>{total}</div>
                <ul className="space-y-2 mb-6">
                  {perks.map(p => (
                    <li key={p} className={`flex items-center gap-2 text-sm ${highlight ? 'text-blue-100' : 'text-slate-600'}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-yellow-300' : 'text-green-500'}`} />{p}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${highlight ? 'bg-white text-blue-700 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>{cta}</a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 border border-blue-100 bg-blue-50 rounded-xl px-4 py-3">
            💡 <strong className="text-slate-700">Logiciel téléphonique à la charge du client.</strong> Intégration CRM incluse. Engagement minimum 3 mois.
          </p>

          {/* Upsell dashboard */}
          <div className="mt-6 rounded-2xl p-6 border border-cyan-200 bg-cyan-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold text-cyan-700 tracking-widest uppercase mb-1">OPTION</div>
              <h3 className="text-slate-900 font-black text-lg mb-1">Dashboard CRM en temps réel</h3>
              <p className="text-slate-600 text-sm max-w-md">Suivez leads traités, performance par agent, taux de contact et ROI. Vision claire de chaque euro investi.</p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-3xl font-black text-slate-900">+200€<span className="text-base font-normal text-slate-500">/mois</span></div>
              <a href="#contact" className="mt-2 block px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-all">Activer le dashboard</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contact" className="py-24 bg-slate-950">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-3">
            Prêt à remplir votre agenda ?
          </h2>
          <p className="text-slate-400 mb-8">
            Sans engagement. On vous rappelle sous 24h.
          </p>
          <DiagForm dark />
          <div className="flex flex-wrap justify-center gap-5 mt-6 text-xs text-slate-600">
            {["Sans engagement", "Démarrage en 7 jours", "Équipe 100% francophone"].map(g => (
              <span key={g} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />{g}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <div className="font-black text-white">⚡ ScaleWithMike</div>
          <div className="flex gap-6">
            <a href="#solution" className="hover:text-white transition-colors">Méthode</a>
            <a href="#preuve" className="hover:text-white transition-colors">Résultats</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
            <Link href="/dashboard" className="hover:text-white transition-colors">CRM</Link>
          </div>
          <div className="text-xs text-slate-700">m.simono@groupe-fc.com · © 2026</div>
        </div>
      </footer>

    </div>
  )
}
