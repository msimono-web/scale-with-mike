'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, CheckCircle2, ChevronDown, Star, Zap, ArrowRight, Users, Shield, TrendingUp, Play, Headphones, Volume2, Pause } from 'lucide-react'

/* ── Formulaire diagnostic ─────────────────────── */
function DiagForm({ dark = false }: { dark?: boolean }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [errors, setErrors] = useState<{ prenom?: string; email?: string; telephone?: string }>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!prenom.trim()) errs.prenom = 'Champ requis'
    if (!email.trim()) errs.email = 'Champ requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Email invalide'
    if (!telephone.trim()) errs.telephone = 'Champ requis'
    else if (!/^[\d\s\+\-\.\(\)]{7,20}$/.test(telephone.trim())) errs.telephone = 'Numéro invalide'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, email, telephone, source: 'Site web' }),
      })
    } catch (e) { console.error(e) }
    finally { setLoading(false); setSent(true) }
  }

  if (sent) return (
    <div className={`rounded-3xl p-8 text-center ${dark ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} border shadow-xl`}>
      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
      <p className={`font-black text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>Demande reçue !</p>
      <p className={`text-sm mt-1 ${dark ? 'text-white/60' : 'text-slate-500'}`}>On vous rappelle sous 24h.</p>
    </div>
  )

  return (
    <div className={`rounded-3xl p-7 shadow-2xl ${dark ? 'bg-white/10 backdrop-blur-lg border-white/20' : 'bg-white border-slate-100'} border`}>
      <p className={`font-black text-sm uppercase tracking-widest text-center mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>Prendre rendez-vous</p>
      <p className={`text-xs text-center mb-5 ${dark ? 'text-white/50' : 'text-slate-400'}`}>Sans engagement · Réponse sous 24h</p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input placeholder="Prénom / Entreprise" value={prenom} onChange={e => { setPrenom(e.target.value); if (errors.prenom) setErrors(prev => ({ ...prev, prenom: undefined })) }}
              className={`w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all ${errors.prenom ? 'border-red-400 ring-2 ring-red-100' : ''} ${dark ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-emerald-400 focus:ring-emerald-400/20' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-100'} border focus:ring-2`} />
            {errors.prenom && <p className="text-red-400 text-xs mt-1 ml-1">{errors.prenom}</p>}
          </div>
          <div className="flex-1">
            <input placeholder="Email" type="email" value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: undefined })) }}
              className={`w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all ${errors.email ? 'border-red-400 ring-2 ring-red-100' : ''} ${dark ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-emerald-400 focus:ring-emerald-400/20' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-100'} border focus:ring-2`} />
            {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>
        </div>
        <div>
          <input placeholder="Téléphone / WhatsApp" value={telephone} onChange={e => { setTelephone(e.target.value); if (errors.telephone) setErrors(prev => ({ ...prev, telephone: undefined })) }}
            className={`w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all ${errors.telephone ? 'border-red-400 ring-2 ring-red-100' : ''} ${dark ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-emerald-400 focus:ring-emerald-400/20' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-100'} border focus:ring-2`} />
          {errors.telephone && <p className="text-red-400 text-xs mt-1 ml-1">{errors.telephone}</p>}
        </div>
        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-4 font-black rounded-full text-sm tracking-widest uppercase shadow-lg hover:brightness-110 hover:scale-[1.01] disabled:opacity-60 transition-all bg-emerald-500 text-white">
          {loading ? 'Envoi…' : 'Prendre rendez-vous →'}
        </button>
        <button onClick={handleSubmit} disabled={loading}
          className={`w-full py-3 text-sm rounded-full transition-all flex items-center justify-center gap-2 font-semibold ${dark ? 'border-white/20 text-white/70 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'} border`}>
          <Phone className="w-4 h-4 text-emerald-500" /> Être rappelé directement
        </button>
      </div>
      <div className={`flex justify-center gap-4 mt-4 text-xs flex-wrap ${dark ? 'text-white/40' : 'text-slate-400'}`}>
        {['🔒 Sécurisé', '⚡ Réponse sous 24h', '✓ Sans engagement'].map(t => <span key={t}>{t}</span>)}
      </div>
    </div>
  )
}

/* ── Dashboard CTA (prénom + téléphone only) ──── */
function DashboardCTA() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prenom, setPrenom] = useState('')
  const [telephone, setTelephone] = useState('')

  const handleSubmit = async () => {
    if (!prenom && !telephone) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, email: '', telephone, source: 'Dashboard CTA' }),
      })
    } catch (e) { console.error(e) }
    finally { setLoading(false); setSent(true) }
  }

  if (sent) return (
    <div className="text-center bg-gradient-to-b from-emerald-50 to-white rounded-3xl border border-emerald-200 py-10 px-6">
      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
      <p className="font-black text-lg text-slate-900">Demande reçue !</p>
      <p className="text-sm mt-1 text-slate-500">On active votre dashboard sous 24h.</p>
    </div>
  )

  return (
    <div className="text-center bg-gradient-to-b from-emerald-50 to-white rounded-3xl border border-emerald-200 py-10 px-6">
      <p className="text-emerald-600 text-xs font-black tracking-widest uppercase mb-3">Ajoutez le à votre plan</p>
      <div className="text-5xl md:text-6xl font-black text-slate-900 mb-2">+200€<span className="text-slate-400 text-xl font-normal">/mois</span></div>
      <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Pas d&apos;engagement supplémentaire. Activé en 24h. Annulable à tout moment.</p>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
        <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)}
          className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition-all bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:ring-amber-100 border focus:ring-2" />
        <input placeholder="Téléphone" value={telephone} onChange={e => setTelephone(e.target.value)}
          className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition-all bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:ring-amber-100 border focus:ring-2" />
      </div>
      <button onClick={handleSubmit} disabled={loading}
        className="inline-flex items-center gap-2 px-10 py-5 font-black text-base tracking-widest uppercase rounded-full transition-all shadow-xl shadow-amber-200 bg-amber-400 text-gray-900 hover:bg-amber-500 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-60">
        <Zap className="w-5 h-5" /> {loading ? 'Envoi…' : 'Activer mon dashboard CRM'}
      </button>
      <p className="text-slate-400 text-xs mt-4">Déploiement en 24h · Compatible avec tous les plans</p>
    </div>
  )
}

/* ── Chatbot ──────────────────────────────────── */
const BOT_RESPONSES: Record<string, string> = {
  'tarifs': 'Nos tarifs démarrent à 900€/agent/mois. Le pack le plus populaire : 5 agents à 850€/agent, soit 4 250€/mois. Tout est inclus : scripts, formation, coaching, reporting.',
  'comment ça marche': 'C\'est simple : vous nous donnez votre fichier prospects → on forme nos agents sur votre offre → ils appellent, qualifient et posent les RDV dans votre agenda. Opérationnel en 7 jours.',
  'délai': 'On démarre en 7 jours ouvrés. Brief, rédaction des scripts, formation des agents — et c\'est parti. Premiers RDV dès la 2e semaine.',
  'secteurs': 'On travaille en B2B et B2C : isolation, rénovation, énergie, formation pro, services aux entreprises, immobilier, tech/SaaS... Le process s\'adapte à votre activité.',
  'rdv': 'CALENDLY',
}

function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{from: 'bot' | 'user', text: string}[]>([
    { from: 'bot', text: 'Bonjour 👋 Je suis l\'assistant ScaleWithMike. Comment puis-je vous aider ?' },
  ])
  const [input, setInput] = useState('')

  const quickReplies = ['Comment ça marche', 'Tarifs', 'Délai', 'Secteurs', 'Prendre RDV']

  const handleSend = (text: string) => {
    const userMsg = text.trim()
    if (!userMsg) return
    setMessages(prev => [...prev, { from: 'user', text: userMsg }])
    setInput('')

    setTimeout(() => {
      const key = userMsg.toLowerCase()
      let reply = 'Bonne question ! Pour une réponse personnalisée, je vous propose de réserver un appel de 15 min avec notre équipe.'
      if (key.includes('tarif') || key.includes('prix') || key.includes('cout') || key.includes('coût')) reply = BOT_RESPONSES['tarifs']
      else if (key.includes('marche') || key.includes('comment') || key.includes('process')) reply = BOT_RESPONSES['comment ça marche']
      else if (key.includes('délai') || key.includes('delai') || key.includes('combien de temps') || key.includes('démarr')) reply = BOT_RESPONSES['délai']
      else if (key.includes('secteur') || key.includes('b2b') || key.includes('b2c') || key.includes('activité')) reply = BOT_RESPONSES['secteurs']
      else if (key.includes('rdv') || key.includes('appel') || key.includes('rendez') || key.includes('réserv') || key.includes('calendly') || key.includes('booking')) reply = BOT_RESPONSES['rdv']

      if (reply === 'CALENDLY') {
        setMessages(prev => [...prev, { from: 'bot', text: 'Parfait ! Réservez votre créneau directement :' }])
      } else {
        setMessages(prev => [...prev, { from: 'bot', text: reply }])
      }
    }, 600)
  }

  return (
    <>
      {/* Floating robot avatar — bottom-right on mobile, middle-right on desktop */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed right-4 sm:right-6 bottom-20 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all hover:scale-110 border-4 border-white overflow-hidden"
          aria-label="Chat"
          style={{ animation: 'botBounce 2s ease-in-out infinite' }}>
          <img src="/chatbot-avatar.avif" alt="Chat avec nous" className="w-full h-full object-cover" />
        </button>
      )}

      {/* ── MOBILE: fullscreen overlay ── */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-50 bg-white flex flex-col" style={{ animation: 'fadeInUp .15s ease-out' }}>
          {/* Header */}
          <div className="bg-gray-950 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs">⚡</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">ScaleWithMike</p>
              <p className="text-white/50 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> En ligne</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 -mr-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors" aria-label="Fermer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === 'user' ? 'bg-emerald-500 text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {messages[messages.length - 1]?.text.includes('créneau') && (
              <div className="flex justify-start">
                <a href="https://calendly.com/m-simono/prenez-rendez-vous-votre-account-strategist-mickael" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-gray-900 font-black text-xs hover:bg-amber-500 transition-all shadow-lg">
                  📅 Réserver mon créneau
                </a>
              </div>
            )}
          </div>
          {/* Quick replies */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {quickReplies.map(qr => (
              <button key={qr} onClick={() => handleSend(qr)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-all">
                {qr}
              </button>
            ))}
          </div>
          {/* Input */}
          <div className="border-t border-slate-200 p-3 flex items-center gap-2 flex-shrink-0" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Posez votre question..."
              className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-slate-700 placeholder-slate-400" />
            <button onClick={() => handleSend(input)} className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all flex-shrink-0">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── DESKTOP: side panel ── */}
      {open && (
        <div className="hidden sm:flex fixed z-50 right-6 top-1/2 -translate-y-1/2 w-[360px] max-h-[500px] rounded-2xl shadow-2xl border border-slate-200 bg-white flex-col overflow-hidden"
          style={{ animation: 'fadeInUp .2s ease-out' }}>
          {/* Header */}
          <div className="bg-gray-950 px-5 py-4 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-xs">⚡</div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">ScaleWithMike</p>
              <p className="text-white/50 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> En ligne</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors" aria-label="Fermer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: '320px' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === 'user' ? 'bg-emerald-500 text-white rounded-br-sm' : 'bg-slate-100 text-slate-700 rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {messages[messages.length - 1]?.text.includes('créneau') && (
              <div className="flex justify-start">
                <a href="https://calendly.com/m-simono/prenez-rendez-vous-votre-account-strategist-mickael" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 text-gray-900 font-black text-sm hover:bg-amber-500 transition-all shadow-lg">
                  📅 Réserver mon créneau (15 min)
                </a>
              </div>
            )}
          </div>
          {/* Quick replies */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {quickReplies.map(qr => (
              <button key={qr} onClick={() => handleSend(qr)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-all">
                {qr}
              </button>
            ))}
          </div>
          {/* Input */}
          <div className="border-t border-slate-200 p-3 flex items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Posez votre question..."
              className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 text-slate-700 placeholder-slate-400" />
            <button onClick={() => handleSend(input)} className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all flex-shrink-0">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes botBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
      `}</style>
    </>
  )
}

/* ── Page ───────────────────────────────────────── */
/* ── Bandeau prix top-of-page ────────────────── */
function PriceBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="relative z-[60] bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)', animation: 'shimmer 3s ease-in-out infinite' }} />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-semibold flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">À partir de</span>
          <span className="sm:hidden">Dès</span>
        </span>
        <span className="text-lg sm:text-xl font-black text-amber-300 drop-shadow-sm">800€/mois</span>
        <span className="hidden md:inline opacity-70">—</span>
        <span className="hidden md:inline">un agent qui appelle du matin au soir pour vous !</span>
        <span className="md:hidden">/ agent dédié</span>
        <a href="#pricing" className="ml-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold uppercase tracking-wider transition-colors backdrop-blur-sm">
          Voir les tarifs →
        </a>
        <button onClick={() => setVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors text-lg leading-none" aria-label="Fermer">×</button>
      </div>
      <style>{`@keyframes shimmer { 0%, 100% { transform: translateX(-100%); } 50% { transform: translateX(100%); } }`}</style>
    </div>
  )
}

/* ── Section audio des agents ────────────────── */
const agentsAudio = [
  { name: 'Sarah', role: 'Téléprospectrice Senior', exp: '4 ans d\'expérience', spec: 'B2B — Services & Conseil', gradient: 'from-rose-500 to-pink-600', initial: 'S', src: '/audio/sarah.mp3' },
  { name: 'Kezia', role: 'Téléprospectrice', exp: '3 ans d\'expérience', spec: 'B2C — Rénovation & Énergie', gradient: 'from-violet-500 to-purple-600', initial: 'K', src: '/audio/kezia.mp3' },
  { name: 'Mihaja', role: 'Téléprospecteur', exp: '3 ans d\'expérience', spec: 'B2B — Tech & Formation', gradient: 'from-sky-500 to-blue-600', initial: 'M', src: '/audio/mihaja.mp3' },
]

function AudioCard({ agent }: { agent: typeof agentsAudio[0] }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => { setCurrentTime(a.currentTime); setProgress((a.currentTime / a.duration) * 100) }
    const onMeta = () => setDuration(a.duration)
    const onEnd = () => { setPlaying(false); setProgress(0); setCurrentTime(0) }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('loadedmetadata', onMeta); a.removeEventListener('ended', onEnd) }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    document.querySelectorAll('audio').forEach(el => { if (el !== a) { el.pause(); el.currentTime = 0 } })
    if (playing) a.pause(); else a.play()
    setPlaying(!playing)
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current
    if (!a) return
    const rect = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration
  }

  const fmt = (s: number) => { if (!s || isNaN(s)) return '0:00'; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}` }

  return (
    <div className={`relative group rounded-2xl border transition-all duration-300 overflow-hidden ${playing ? 'border-emerald-400/50 shadow-lg shadow-emerald-500/10 scale-[1.02]' : 'border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5'}`} style={{ background: 'rgba(255,255,255,0.03)' }}>
      {playing && <div className="absolute inset-0 opacity-10 rounded-2xl"><div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} blur-xl`} /></div>}
      <div className="relative p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className={`relative flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
            {agent.initial}
            {playing && <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-950 animate-pulse" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg leading-tight">{agent.name}</h3>
            <p className="text-slate-400 text-sm mt-0.5">{agent.role}</p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-xs text-slate-500">{agent.exp}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">{agent.spec}</span>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/5">
          <audio ref={audioRef} src={agent.src} preload="metadata" />
          <div className="flex items-center gap-3">
            <button onClick={toggle} className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${playing ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="h-1.5 bg-white/10 rounded-full cursor-pointer group/bar relative" onClick={seek}>
                <div className={`h-full rounded-full transition-all duration-100 ${playing ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-white/30'}`} style={{ width: `${progress}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 6px)` }} />
              </div>
              <div className="flex justify-between mt-1.5 text-xs text-slate-500">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
            <Volume2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
          </div>
        </div>
        <p className="text-center text-xs text-slate-600 mt-3 italic">Extrait d&apos;un appel de prospection réel</p>
      </div>
    </div>
  )
}

function AudioSection() {
  return (
    <section id="audio-agents" className="py-20 bg-gray-950 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
            <Headphones className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Écoutez nos agents</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Des voix qui{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">convertissent.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Écoutez la qualité de nos agents. Professionnels, formés sur votre offre, ils posent les bonnes questions dès le premier appel.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {agentsAudio.map(a => <AudioCard key={a.name} agent={a} />)}
        </div>
        <div className="text-center mt-12">
          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3.5 font-black text-sm tracking-widest uppercase rounded-full bg-amber-400 text-gray-900 hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40">
            <Phone className="w-4 h-4" /> Prendre rendez-vous
          </a>
          <p className="text-slate-600 text-sm mt-3">Discutez avec nous et découvrez comment on peut remplir votre agenda</p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const router = useRouter()
  const [agents1, setAgents1] = useState(3)
  const [agents2, setAgents2] = useState(5)
  const [agents3, setAgents3] = useState(10)
  const [pricePulse, setPricePulse] = useState<number | null>(null)
  const [pricingVisible, setPricingVisible] = useState(false)
  const pricingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = pricingRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setPricingVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Scroll to top on initial load (clear any leftover #hash)
  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
    window.scrollTo(0, 0)
  }, [])

  // Redirect OAuth code to /auth/callback if Supabase lands on root
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('code') && !params.has('type')) {
      router.replace(`/auth/callback?${params.toString()}`)
    }
  }, [router])

  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        {/* Row 1 : Logo + liens desktop + CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.png" alt="ScaleWithMike" width={38} height={38} className="rounded-xl" />
            <span className="font-black text-slate-900 text-lg tracking-tight">Scale<span className="text-emerald-500">With</span>Mike</span>
          </div>
          <div className="hidden md:flex items-center gap-7">
            {[['#methode', 'Méthode'], ['#pricing', 'Tarifs'], ['#resultats', 'Résultats'], ['#equipe', 'Équipe']].map(([h, l]) => (
              <a key={h} href={h} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">{l}</a>
            ))}
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-amber-50 border border-amber-200 text-amber-600">
              <Zap className="w-3 h-3" /> 3 slots dispo
            </span>
          </div>
          <a href="#contact" className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 font-black text-[10px] sm:text-xs tracking-widest uppercase rounded-full shadow-lg transition-all bg-amber-400 text-gray-900 hover:bg-amber-500 hover:scale-[1.02]">
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Prendre rendez-vous</span> <span className="sm:hidden">Prendre RDV</span>
          </a>
        </div>
        {/* Row 2 : Onglets mobile uniquement */}
        <div className="md:hidden flex items-center justify-center gap-5 px-4 pb-2.5 -mt-0.5">
          {[['#methode', 'Méthode'], ['#pricing', 'Tarifs'], ['#resultats', 'Résultats'], ['#equipe', 'Équipe']].map(([h, l]) => (
            <a key={h} href={h} className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap">{l}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 md:pt-16 overflow-hidden bg-gray-950">
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Gradient orbs — ambient background glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)', animation: 'floatOrb 8s ease-in-out infinite' }} />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)', animation: 'floatOrb 10s ease-in-out 2s infinite reverse' }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)', animation: 'floatOrb 12s ease-in-out 4s infinite' }} />

        {/* Geometric lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="0" x2="30%" y2="100%" stroke="white" strokeWidth="1" />
          <line x1="50%" y1="0" x2="70%" y2="100%" stroke="white" strokeWidth="1" />
          <line x1="80%" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="1" />
          <line x1="0" y1="30%" x2="100%" y2="20%" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="70%" x2="100%" y2="80%" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Sparkles animation */}
        {[
          { top: '15%', left: '10%', delay: '0s', size: 24 },
          { top: '25%', left: '85%', delay: '1.5s', size: 20 },
          { top: '70%', left: '5%', delay: '3s', size: 16 },
          { top: '80%', left: '75%', delay: '0.8s', size: 22 },
          { top: '45%', left: '50%', delay: '2.2s', size: 18 },
          { top: '10%', left: '60%', delay: '1s', size: 14 },
          { top: '60%', left: '30%', delay: '2.8s', size: 20 },
          { top: '35%', left: '90%', delay: '0.5s', size: 16 },
        ].map((s, i) => (
          <svg key={i} className="absolute pointer-events-none" style={{ top: s.top, left: s.left, width: s.size, height: s.size, animation: `sparkle 3s ease-in-out ${s.delay} infinite` }} viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.5 9.5L21 12L13.5 14.5L12 22L10.5 14.5L3 12L10.5 9.5L12 2Z" fill="rgba(245,158,11,0.4)" />
          </svg>
        ))}

        <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase mb-8 border border-amber-400/30 bg-amber-400/10 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Prospection téléphonique externalisée
              </div>

              {/* Avatars + social proof */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {[12, 53, 59].map(id => (
                    <img key={id} src={`https://i.pravatar.cc/40?img=${id}`} alt="" className="w-8 h-8 rounded-full border-2 border-gray-950" />
                  ))}
                </div>
                <span className="text-white/60 text-sm font-semibold">+30 entreprises accompagnées</span>
              </div>

              <h1 className="font-black leading-[0.95] uppercase text-white mb-4"
                style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)' }}>
                Obtenez 2 à 5<br />rendez-vous qualifiés<br />
                <span className="text-amber-400">par jour.</span>
              </h1>

              <p className="text-white/60 text-lg mb-6 leading-relaxed max-w-lg">
                Grâce à la prospection téléphonique externalisée.<br />
                <strong className="text-white/80">B2B et B2C</strong> — isolation, formation, services, immobilier, énergie...
              </p>

              {/* Bandeau prix vert cliquable */}
              <a href="#contact" className="group flex items-center gap-3 px-6 py-3.5 mb-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] w-fit cursor-pointer">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold">
                  À partir de <span className="text-lg sm:text-xl font-black text-amber-300">800€/mois</span> — un agent qui appelle du matin au soir pour vous !
                </span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>

              {/* Bouton écouter les agents */}
              <a href="#audio-agents" className="group inline-flex items-center gap-2.5 px-5 py-3 mb-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/30 text-white/80 hover:text-white transition-all duration-300 w-fit cursor-pointer">
                <Headphones className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Écoutez vos futurs agents !</span>
                <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
              </a>

              {/* Badges */}
              <div className="flex flex-col gap-3 mb-8">
                {[
                  { icon: <Phone className="w-4 h-4" />, text: 'Pipeline commercial rempli en continu' },
                  { icon: <Zap className="w-4 h-4" />, text: 'Un système de prospection qui travaille pour vous' },
                  { icon: <Users className="w-4 h-4" />, text: 'Équipe de SDR externalisée, formée et encadrée' },
                ].map(({ icon, text }) => (
                  <div key={text} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-semibold bg-white/5 border border-white/10 text-white/80 w-fit">
                    <span className="text-emerald-400">{icon}</span>{text}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 sm:gap-8 pt-6 border-t border-white/10">
                {[
                  { val: '2-5', lbl: 'RDV qualifiés / jour', c: 'text-emerald-400' },
                  { val: '7j', lbl: 'Pour démarrer', c: 'text-amber-400' },
                  { val: '94%', lbl: 'Satisfaction', c: 'text-sky-400' },
                ].map(({ val, lbl, c }) => (
                  <div key={lbl}>
                    <div className={`text-xl sm:text-2xl font-black ${c}`}>{val}</div>
                    <div className="text-white/40 text-[10px] sm:text-xs mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendly embed — widget officiel */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gray-950 px-6 py-4 text-center">
                <p className="text-white font-black text-sm uppercase tracking-widest">Vous souhaitez booster votre acquisition ?</p>
                <p className="text-white/50 text-xs mt-1">Prenez rendez-vous — c&apos;est gratuit</p>
              </div>
              <div className="p-1">
                <div
                  className="calendly-inline-widget rounded-xl h-[350px] sm:h-[420px]"
                  data-url="https://calendly.com/m-simono/prenez-rendez-vous-votre-account-strategist-mickael?hide_gdpr_banner=1&background_color=ffffff&text_color=1e293b&primary_color=10b981"
                  style={{ minWidth: '280px' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* URGENCY + LOGOS */}
      <div className="py-3 bg-amber-400">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-gray-900 text-sm font-bold">Capacité limitée — Plus que <strong>3 slots disponibles</strong> pour mai 2026</span>
        </div>
      </div>

      <div className="bg-gray-950 py-6">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-white/30 text-xs uppercase tracking-widest font-semibold text-center mb-4">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-4">
            {['Groupe FC', 'NovaBTP', 'FormaPro', 'AXS Consulting', 'IndusTech', 'Réseaux Pro'].map(name => (
              <span key={name} className="text-white/40 font-black text-sm tracking-wide">{name}</span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 items-center pt-4 border-t border-white/10">
            <span className="text-white/30 text-sm uppercase tracking-widest font-semibold">Secteurs :</span>
            {['Isolation / Rénovation', 'Services B2B', 'Immobilier', 'Tech / SaaS', 'Formation Pro', 'Énergie'].map(s => (
              <span key={s} className="font-bold text-white/50 text-sm px-3 py-1.5 rounded-full border border-white/10 bg-white/5">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CE QU'ON MET EN PLACE */}
      <section id="methode" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-emerald-600 text-xs font-black tracking-widest uppercase mb-4">Ce que l&apos;on met en place</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              Votre équipe de prospection.<br /><span className="text-emerald-500">Clé en main.</span>
            </h2>
            <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3.5 mt-4 font-black text-sm tracking-widest uppercase rounded-full bg-amber-400 text-gray-900 hover:bg-amber-500 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
              Prendre rendez-vous
            </a>
          </div>

          {/* Block 1 — Cold callers */}
          <div className="grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-slate-200 mb-6 shadow-sm">
            <div className="p-8 md:p-10 flex flex-col justify-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-900 mb-4">Des téléprospecteurs dédiés</h3>
              <div className="space-y-3">
                {[
                  { icon: <Phone className="w-4 h-4" />, text: '2 à 5 RDV qualifiés par jour' },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Reporting quotidien détaillé' },
                  { icon: <Star className="w-4 h-4" />, text: 'Experts outbound, formés sur votre offre' },
                  { icon: <Shield className="w-4 h-4" />, text: 'Remplacement immédiat si absence' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-emerald-500 flex-shrink-0">{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] md:aspect-auto">
              <Image src="/team-1.jpg" alt="Téléprospecteurs ScaleWithMike" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>

          {/* Block 2 — Chef de projet */}
          <div className="grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-slate-200 mb-6 shadow-sm">
            <div className="relative aspect-[4/3] md:aspect-auto order-2 md:order-1">
              <Image src="/team-2.jpg" alt="Chef de projet ScaleWithMike" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center bg-slate-50 order-1 md:order-2">
              <h3 className="text-2xl font-black text-slate-900 mb-4">Un chef de projet dédié</h3>
              <div className="space-y-3">
                {[
                  { icon: <Users className="w-4 h-4" />, text: 'Gère l\'ensemble de votre campagne' },
                  { icon: <TrendingUp className="w-4 h-4" />, text: 'Optimise les scripts en continu' },
                  { icon: <Zap className="w-4 h-4" />, text: 'Suit les performances et challenge les agents' },
                  { icon: <Shield className="w-4 h-4" />, text: 'Votre interlocuteur unique' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-emerald-500 flex-shrink-0">{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block 3 — Process en 3 étapes */}
          <div className="grid md:grid-cols-3 gap-4 mt-10">
            {[
              { num: '01', title: 'Vous donnez le fichier', desc: 'Base de données, listing, Excel... On peut aussi vous aider à constituer le fichier.', icon: '📋' },
              { num: '02', title: 'On appelle et qualifie', desc: 'Questions de qualification précises, détection du besoin réel, filtrage selon vos critères.', icon: '📞' },
              { num: '03', title: 'Les RDV tombent', desc: 'Seuls les prospects qualifiés arrivent dans votre agenda. Vous n\'avez plus qu\'à closer.', icon: '📅' },
            ].map(({ num, title, desc, icon }) => (
              <div key={num} className="rounded-3xl p-7 border border-slate-200 bg-white text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-xs font-black text-emerald-500 tracking-widest uppercase mb-2">Étape {num}</div>
                <h3 className="font-black text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANT / APRÈS */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-emerald-600 text-xs font-black tracking-widest uppercase mb-3">Le constat</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Pourquoi externaliser vos appels ?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-black text-sm">✗</div>
                <span className="font-black text-red-700 uppercase text-sm tracking-widest">Le problème</span>
              </div>
              <div className="space-y-3">
                {[
                  'Vos équipes prospectent ET gèrent les interventions — elles font mal les deux',
                  'Votre fichier prospects dort dans un Excel',
                  'Pas le temps d\'appeler pour qualifier, confirmer ou relancer',
                  'Vous embauchez un SDR = 4 000€/mois, 3 mois de ramp-up, risque de turnover',
                  'Résultat : agenda vide, interventions non confirmées, pipeline au point mort',
                ].map(t => (
                  <p key={t} className="text-red-800/70 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">—</span>{t}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm">✓</div>
                <span className="font-black text-emerald-700 uppercase text-sm tracking-widest">Avec ScaleWithMike</span>
              </div>
              <div className="space-y-3">
                {[
                  'Une équipe dédiée qui appelle votre fichier chaque jour',
                  'Qualification, prise de RDV ou confirmation d\'interventions',
                  '2 à 5 RDV qualifiés par jour selon l\'activité et le volume',
                  'Opérationnel en 7 jours, pas 3 mois',
                  'Vos équipes ne gèrent plus que ce qui a été validé par téléphone',
                ].map(t => (
                  <p key={t} className="text-emerald-800/70 text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RÉSULTATS — CASE STUDIES */}
      <section id="resultats" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-emerald-600 text-xs font-black tracking-widest uppercase mb-3">Résultats clients</p>
            <h2 className="text-4xl font-black text-slate-900 mb-2">Ça marche. Voici les chiffres.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              {
                sector: 'Isolation / B2C',
                company: 'Entreprise de rénovation énergétique',
                mission: '3 agents — fichier de 8 000 particuliers',
                result: '312 RDV qualifiés en 3 mois',
                outcome: '47 chantiers signés — ROI x6',
                quote: 'Les agents posent les bonnes questions dès le premier appel. On ne reçoit que des prospects réellement éligibles.',
                author: 'Laurent M., Dirigeant',
                img: 'https://i.pravatar.cc/80?img=12',
                stars: 5,
              },
              {
                sector: 'Services B2B',
                company: 'Cabinet de conseil en RH',
                mission: '5 agents — fichier de 4 200 PME',
                result: '94 RDV décideurs en 3 mois',
                outcome: '17 contrats signés — 68 000€ de CA',
                quote: 'On leur a donné notre base, ils ont rempli notre agenda. Nos commerciaux n\'ont fait que closer.',
                author: 'Marc D., Directeur commercial',
                img: 'https://i.pravatar.cc/80?img=53',
                stars: 5,
              },
              {
                sector: 'Formation Pro',
                company: 'Organisme certifié Qualiopi',
                mission: '5 agents — fichier de 6 500 contacts',
                result: '53 RDV qualifiés en 3 mois',
                outcome: '21 inscrits — ROI x4',
                quote: 'On avait un fichier qui dormait depuis 6 mois. En 2 semaines, les premiers RDV sont tombés.',
                author: 'Karim B., Responsable développement',
                img: 'https://i.pravatar.cc/80?img=59',
                stars: 5,
              },
            ].map(({ sector, company, mission, result, outcome, quote, author, img, stars }) => (
              <div key={sector} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-md hover:shadow-lg transition-shadow flex flex-col">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                {/* Quote */}
                <p className="text-slate-700 text-sm italic mb-4 leading-relaxed">&ldquo;{quote}&rdquo;</p>
                {/* Author with photo */}
                <div className="flex items-center gap-3 mb-5">
                  <img src={img} alt={author} className="w-11 h-11 rounded-full object-cover border-2 border-emerald-200" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{author}</p>
                    <p className="text-slate-400 text-xs">{company}</p>
                  </div>
                </div>
                {/* Stats */}
                <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{sector}</p>
                  <p className="text-xs text-slate-400 italic">{mission}</p>
                  <p className="text-lg font-black text-slate-900">{result}</p>
                  <div className="bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                    <p className="text-emerald-700 text-sm font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />{outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-slate-50 rounded-full py-5 px-8 border border-slate-200">
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="font-black text-slate-900 ml-1">4.9/5</span>
            </div>
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />
            <span className="text-slate-500 text-sm"><strong className="text-slate-700">+30 entreprises</strong> accompagnées</span>
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />
            <span className="text-slate-500 text-sm flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" />Résultats vérifiables</span>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-24 bg-gray-950 border-y border-white/10 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-3">Le calcul est vite fait</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">3 agents formés.<br /><span className="text-emerald-400">Moins cher qu&apos;un seul SDR.</span></h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">Au prix d&apos;un commercial interne, vous avez une équipe complète — opérationnelle en 7 jours.</p>
          </div>

          {/* Big price bubbles */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 mb-14">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center border-2 border-red-400/40 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                <div className="text-3xl sm:text-4xl font-black text-red-400">4 000€</div>
                <p className="text-red-300/60 text-xs font-semibold mt-0.5">/mois</p>
              </div>
              <p className="text-white/40 text-sm mt-3 font-medium">1 SDR interne</p>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-white/15">vs</div>
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center border-2 border-emerald-400/50 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400">2 700€</div>
                <p className="text-emerald-400/60 text-xs font-semibold mt-0.5">/mois</p>
              </div>
              <p className="text-emerald-400/70 text-sm mt-3 font-semibold">3 téléprospecteurs</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* SDR interne — rouge */}
            <div className="rounded-[2rem] border-2 border-red-400/30 bg-gradient-to-b from-red-500/5 to-white/[0.02] p-8 shadow-[0_0_30px_rgba(239,68,68,0.08)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-red-500/15 border border-red-400/20 flex items-center justify-center"><Users className="w-5 h-5 text-red-400/70" /></div>
                <div>
                  <p className="font-black text-white text-base">SDR interne</p>
                  <p className="text-white/40 text-sm font-medium">1 seul agent — tout seul</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[['Salaire net + charges', '3 300€'], ['Outils, formation & management', '700€']].map(([l, c]) => (
                  <div key={l} className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-3">
                    <span className="text-white/50 text-sm font-medium">{l}</span>
                    <span className="font-bold text-white/70 text-sm">{c}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-red-500/10 border border-red-400/20 px-5 py-4 flex items-center justify-between mb-5">
                <span className="font-black text-white text-base">Total</span>
                <span className="text-2xl font-black text-red-400">4 000€<span className="text-sm font-normal text-white/30 ml-0.5">/mois</span></span>
              </div>
              <div className="space-y-2">
                {['3 mois de ramp-up avant d\'être productif', 'Risque de turnover = tout recommencer', 'Seul face à un fichier de milliers de contacts'].map(t => (
                  <p key={t} className="text-white/35 text-sm font-medium flex items-start gap-2 leading-relaxed">
                    <span className="text-red-400/60 mt-0.5 flex-shrink-0">✗</span>{t}
                  </p>
                ))}
              </div>
            </div>

            {/* ScaleWithMike — vert */}
            <div className="rounded-[2rem] border-2 border-emerald-400/40 bg-gradient-to-b from-emerald-500/10 to-emerald-500/[0.02] p-8 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.12)]">
              <div className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-black uppercase tracking-widest bg-emerald-500 text-white">3 agents pour le prix de moins d&apos;1</div>
              <div className="flex items-center gap-3 mb-6 mt-5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"><Zap className="w-5 h-5 text-white" /></div>
                <div>
                  <p className="font-black text-white text-base">ScaleWithMike</p>
                  <p className="text-emerald-400 text-sm font-semibold">3 téléprospecteurs formés et encadrés</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[['3 téléprospecteurs dédiés', '2 700€'], ['Scripts, formation, coaching', 'Inclus'], ['Responsable de compte dédié', 'Inclus'], ['Reporting & call recording', 'Inclus']].map(([l, c]) => (
                  <div key={l} className="flex items-center justify-between rounded-2xl bg-white/[0.04] border border-emerald-500/10 px-4 py-3">
                    <span className="text-white/70 text-sm font-medium">{l}</span>
                    <span className={`font-bold text-sm ${c === 'Inclus' ? 'text-emerald-400' : 'text-white'}`}>{c}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 px-5 py-4 flex items-center justify-between mb-5">
                <span className="font-black text-white text-base">Total</span>
                <span className="text-2xl font-black text-emerald-400">2 700€<span className="text-sm font-normal text-white/40 ml-0.5">/mois</span></span>
              </div>
              <div className="space-y-2">
                {['Opérationnel en 7 jours', 'Encadrement quotidien', 'Remplacement immédiat si absence'].map(t => (
                  <p key={t} className="text-emerald-400/80 text-sm font-semibold flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />{t}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom callout */}
          <div className="text-center rounded-[2rem] py-8 px-8 border border-emerald-400/30 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
            <p className="text-emerald-400 font-black text-xl sm:text-2xl mb-2 leading-tight">3 agents formés et encadrés. 33% moins cher qu&apos;un seul SDR.</p>
            <p className="text-white/50 text-sm font-medium">Zéro recrutement. Zéro formation. Zéro risque RH.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-white overflow-hidden" ref={pricingRef}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Titre animé */}
          <div className={`text-center mb-12 transition-all duration-700 ease-out ${pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-emerald-600 text-xs font-black tracking-widest uppercase mb-3">Tarifs</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
              Un seul service.<br /><span className="text-emerald-500">Choisissez le volume.</span>
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">Le service est <strong>identique</strong> — seul le nombre d&apos;agents change.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              { agentsVal: agents1, setAgents: setAgents1, min: 3, max: 4, price: 900, badge: 'STARTER', cta: 'Démarrer',
                color: { border: 'border-slate-700', shadow: 'shadow-xl shadow-slate-200', pulse: 'border-slate-500 shadow-[0_0_25px_rgba(51,65,85,0.25)]', badgeBg: 'bg-slate-800', iconText: 'text-slate-500', numText: 'text-slate-700', totalText: 'text-slate-700', pillBg: 'bg-slate-50 border-slate-200', pillPulseBg: 'bg-slate-50', btnBg: 'text-slate-500 hover:bg-slate-100', btnDisabled: 'text-slate-200', agentLabel: 'text-slate-400', ctaBg: 'bg-slate-900 text-white hover:bg-slate-700' } },
              { agentsVal: agents2, setAgents: setAgents2, min: 5, max: 9, price: 850, badge: 'POPULAIRE', cta: 'Choisir ce plan',
                color: { border: 'border-emerald-500', shadow: 'shadow-2xl shadow-emerald-100 md:scale-[1.04]', pulse: 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]', badgeBg: 'bg-emerald-500', iconText: 'text-emerald-600', numText: 'text-emerald-600', totalText: 'text-emerald-600', pillBg: 'bg-emerald-50 border-emerald-200', pillPulseBg: 'bg-emerald-50', btnBg: 'text-emerald-500 hover:bg-emerald-100', btnDisabled: 'text-slate-200', agentLabel: 'text-emerald-500', ctaBg: 'bg-emerald-500 text-white hover:bg-emerald-600' } },
              { agentsVal: agents3, setAgents: setAgents3, min: 10, max: 20, price: 800, badge: 'ENTERPRISE', cta: 'Nous contacter',
                color: { border: 'border-amber-400', shadow: 'shadow-xl shadow-amber-100', pulse: 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]', badgeBg: 'bg-amber-400 text-slate-900', iconText: 'text-amber-500', numText: 'text-amber-600', totalText: 'text-amber-600', pillBg: 'bg-amber-50 border-amber-200', pillPulseBg: 'bg-amber-50', btnBg: 'text-amber-500 hover:bg-amber-100', btnDisabled: 'text-slate-200', agentLabel: 'text-amber-500', ctaBg: 'bg-amber-400 text-slate-900 hover:bg-amber-500' } },
            ].map(({ agentsVal, setAgents, min, max, price, badge, cta, color }, idx) => {
              const total = (agentsVal * price).toLocaleString('fr-FR')
              const isPulsing = pricePulse === min
              const handleChange = (newVal: number) => {
                setAgents(newVal)
                setPricePulse(min)
                setTimeout(() => setPricePulse(null), 600)
              }
              const delays = ['delay-[200ms]', 'delay-[400ms]', 'delay-[600ms]']
              return (
              <div key={min} className={`relative rounded-3xl border-2 overflow-hidden flex flex-col bg-white transition-all duration-700 ease-out ${pricingVisible ? `opacity-100 translate-y-0 ${delays[idx]}` : 'opacity-0 translate-y-12'} ${isPulsing ? `${color.pulse} !scale-[1.02]` : `${color.border} ${color.shadow}`}`} style={{ transitionDelay: pricingVisible ? `${200 + idx * 200}ms` : '0ms' }}>
                <div className={`absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-black uppercase tracking-widest text-white ${color.badgeBg}`}>{badge}</div>
                <div className="p-7 flex flex-col flex-1 pt-10">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl mb-3 border transition-all duration-300 ${color.pillBg}`}>
                      <Users className={`w-5 h-5 ${color.iconText}`} />
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleChange(Math.max(min, agentsVal - 1))} className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg font-black transition-all active:scale-90 ${agentsVal <= min ? color.btnDisabled + ' cursor-not-allowed' : color.btnBg}`} disabled={agentsVal <= min}>−</button>
                        <span className={`text-2xl font-black min-w-[2ch] text-center transition-all duration-300 ${isPulsing ? 'scale-125' : 'scale-100'} ${color.numText}`}>{agentsVal}</span>
                        <button onClick={() => handleChange(Math.min(max, agentsVal + 1))} className={`w-7 h-7 rounded-lg flex items-center justify-center text-lg font-black transition-all active:scale-90 ${agentsVal >= max ? color.btnDisabled + ' cursor-not-allowed' : color.btnBg}`} disabled={agentsVal >= max}>+</button>
                      </div>
                      <span className={`text-sm font-semibold ${color.agentLabel}`}>agents</span>
                    </div>
                    <p className="text-slate-400 text-xs">téléprospecteurs dédiés · {min} à {max}</p>
                  </div>
                  <div className="text-center mb-2">
                    <span className="text-5xl font-black text-slate-900">{price}€</span>
                    <span className="text-slate-400 text-sm">/agent/mois</span>
                  </div>
                  <div className={`text-center font-black text-lg mb-6 transition-all duration-300 ${isPulsing ? 'scale-110' : 'scale-100'} ${color.totalText}`}>
                    <span className={`inline-block px-3 py-1 rounded-lg transition-all duration-300 ${isPulsing ? color.pillPulseBg : 'bg-transparent'}`}>
                      = {total}€ <span className="font-normal text-sm text-slate-400">/ mois</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-center text-sm font-semibold mb-6 border border-slate-200 text-slate-600">
                    2 à 5 RDV qualifiés / jour
                  </div>
                  <a href="#contact" className={`mt-auto block w-full py-3.5 rounded-full text-sm font-black text-center uppercase tracking-widest transition-all hover:scale-[1.02] hover:shadow-lg ${color.ctaBg}`}>{cta}</a>
                </div>
              </div>
              )
            })}
          </div>

          {/* Tout inclus */}
          <div className={`rounded-3xl border border-slate-200 bg-slate-50 p-8 transition-all duration-700 ease-out ${pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: pricingVisible ? '900ms' : '0ms' }}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-black tracking-widest uppercase text-slate-500">Inclus dans les 3 plans — sans exception</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
              {['Scripts d\'appel rédigés et optimisés', 'Formation des agents sur votre offre', 'Relances planifiées (J+1, J+3, J+7)', 'Questions de qualification sur-mesure', '1 responsable de compte dédié', 'Call recording de chaque appel', 'Reporting hebdomadaire', 'A/B testing des scripts', 'Intégration agenda (Google / Outlook)'].map(f => (
                <div key={f} className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" />{f}
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-6 pt-5 border-t border-slate-200">
              💡 <strong className="text-slate-600">Logiciel téléphonique à la charge du client.</strong> · Engagement minimum 3 mois.
            </p>
          </div>

          {/* Dashboard upsell teaser in pricing */}
          <div className={`mt-8 rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100/50 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 transition-all duration-700 ease-out ${pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: pricingVisible ? '1100ms' : '0ms' }}>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200/50 rounded-full text-amber-700 text-xs font-black tracking-widest uppercase mb-3">
                <Zap className="w-3 h-3" /> Option populaire
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Dashboard CRM temps réel — +200€/mois</h3>
              <p className="text-slate-600 text-sm">Pipeline visuel, stats par agent, écoute des appels, coût par RDV. Tout en un clic.</p>
            </div>
            <a href="#dashboard" className="flex-shrink-0 inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-black text-xs sm:text-sm tracking-widest uppercase rounded-full bg-amber-400 text-slate-900 hover:bg-amber-500 transition-all shadow-lg shadow-amber-200 w-full md:w-auto justify-center hover:scale-[1.02]">
              <Zap className="w-4 h-4" /> Découvrir
            </a>
          </div>
        </div>
      </section>

      {/* L'ÉQUIPE */}
      <section id="equipe" className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-emerald-400 text-xs font-black tracking-widest uppercase mb-3">Qui sommes-nous</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">11 ans dans l&apos;acquisition.<br /><span className="text-emerald-400">Un centre d&apos;appels bâti sur le terrain.</span></h2>
          </div>

          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-white/70 text-base leading-relaxed mb-4">
              À la base, on est une <strong className="text-white">agence marketing spécialisée en SEA</strong>{' '}depuis près de 11 ans. Google Ads, Meta Ads, acquisition payante — c&apos;est notre métier.
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-4">
              Mais on a vite compris que générer du trafic ne suffisait pas. Le maillon manquant, c&apos;était <strong className="text-white">l&apos;appel</strong>. Qualifier au téléphone, poser le RDV, relancer — c&apos;est ce qui transforme un fichier en chiffre d&apos;affaires.
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              On a testé plusieurs équipes. On a trouvé les bonnes personnes, construit une relation solide, et ouvert notre propre centre d&apos;appels — <strong className="text-white">70 postes, une équipe formée et encadrée au quotidien</strong>.
            </p>
          </div>

          {/* Photos */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10">
              <Image src="/team-1.jpg" alt="L'équipe ScaleWithMike — Centre d'appels" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10">
              <Image src="/team-2.jpg" alt="L'équipe ScaleWithMike" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
          <p className="text-center text-white/30 text-xs mb-10">Notre équipe — 70 postes opérationnels</p>

          {/* Stats équipe */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: '11 ans', lbl: 'd\'expérience en acquisition' },
              { val: '70', lbl: 'postes au centre d\'appels' },
              { val: '100%', lbl: 'francophone' },
              { val: '6j/7', lbl: 'disponibilité opérationnelle' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center bg-white/5 rounded-3xl py-5 px-3 border border-white/10">
                <div className="text-2xl font-black text-emerald-400 mb-1">{val}</div>
                <div className="text-white/50 text-xs">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION AUDIO AGENTS */}
      <AudioSection />

      {/* PARTENAIRES */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-emerald-600 text-xs font-black tracking-widest uppercase mb-3">Nos partenaires</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Ils nous font confiance</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Ringover', logo: 'https://cdn.brandfetch.io/ringover.com/w/256/h/50/logo' },
              { name: 'Aircall', logo: 'https://cdn.brandfetch.io/aircall.io/w/256/h/50/logo' },
              { name: 'HubSpot', logo: 'https://cdn.brandfetch.io/hubspot.com/w/256/h/50/logo' },
              { name: 'n8n', logo: 'https://cdn.brandfetch.io/n8n.io/w/256/h/50/logo' },
            ].map(({ name, logo }) => (
              <div key={name} className="flex items-center justify-center py-6 px-4 rounded-3xl border border-slate-100 bg-slate-50/50 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all">
                <img src={logo} alt={name} className="h-8 max-w-[140px] object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-slate-400 font-black text-lg tracking-wide">${name}</span>` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD UPSELL */}
      <section id="dashboard" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-600 text-xs font-black tracking-widest uppercase mb-6">
              <Zap className="w-3 h-3" /> Option — +200€/mois
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Suivez chaque appel,<br /><span className="text-emerald-500">chaque RDV, chaque euro.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Dashboard CRM dédié. Pipeline visuel, stats par agent, coût par RDV — tout en temps réel.
            </p>
          </div>

          {/* MOCKUP */}
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-4 mb-10 shadow-2xl max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 bg-white/10 rounded-lg px-3 py-1 text-white/30 text-xs text-center">crm.scalewithmike.com</div>
            </div>
            <div className="bg-slate-950 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'Appels ce mois', value: '4 820', change: '+12%', color: 'text-sky-400' },
                  { label: 'RDV posés', value: '94', change: '+23%', color: 'text-emerald-400' },
                  { label: 'Taux de contact', value: '68%', change: '+5%', color: 'text-amber-400' },
                  { label: 'Coût / RDV', value: '28€', change: '-8%', color: 'text-purple-400' },
                ].map(({ label, value, change, color }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/40 text-xs mb-1">{label}</p>
                    <p className={`text-xl font-black ${color}`}>{value}</p>
                    <p className="text-emerald-400 text-xs font-semibold">{change}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
                {[
                  { label: 'À appeler', count: 1842, color: 'bg-sky-500/20 border-sky-500/30' },
                  { label: 'Contacté', count: 2450, color: 'bg-indigo-500/20 border-indigo-500/30' },
                  { label: 'Qualifié', count: 312, color: 'bg-amber-500/20 border-amber-500/30' },
                  { label: 'RDV posé', count: 94, color: 'bg-emerald-500/20 border-emerald-500/30' },
                  { label: 'Signé', count: 17, color: 'bg-emerald-600/20 border-emerald-600/30' },
                ].map(({ label, count, color }) => (
                  <div key={label} className={`${color} border rounded-lg p-1.5 sm:p-2 text-center`}>
                    <p className="text-white/50 text-[10px] sm:text-xs mb-0.5">{label}</p>
                    <p className="text-white font-black text-xs sm:text-sm">{count}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-end gap-1 h-20">
                {[35, 42, 38, 55, 48, 62, 58, 71, 65, 78, 82, 94].map((v, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${v}%`, background: `rgba(16, 185, 129, ${0.3 + (v / 140)})` }} />
                ))}
              </div>
              <p className="text-white/20 text-xs text-center">Aperçu — données fictives</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {[
              { icon: '📊', title: 'Pipeline visuel', desc: 'Chaque prospect, de l\'appel au closing.' },
              { icon: '👥', title: 'Stats par agent', desc: 'Appels, taux de contact, RDV posés.' },
              { icon: '🎧', title: 'Écoute des appels', desc: 'Accès à tous les enregistrements.' },
              { icon: '💰', title: 'Coût par RDV', desc: 'ROI mesuré, pas estimé.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-black text-slate-900 mb-1 text-sm">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <DashboardCTA />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-emerald-600 text-xs font-black tracking-widest uppercase mb-3">Questions fréquentes</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Ce que nos clients demandent</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Concrètement, comment ça se passe ?', a: 'Vous nous transmettez votre fichier de prospects (Excel, CSV, CRM...). On rédige les scripts d\'appel avec vous, on forme les agents sur votre offre, et ils commencent à appeler. Les RDV qualifiés arrivent directement dans votre agenda.' },
              { q: 'C\'est quoi le délai pour démarrer ?', a: '7 jours ouvrés. Brief de votre offre, rédaction des scripts, formation des agents, et c\'est parti. Premiers RDV dès la 2e semaine.' },
              { q: 'Ça marche en B2C aussi ?', a: 'Oui. On fait de la prospection B2C (isolation, rénovation, énergie, etc.) et B2B (services, conseil, tech...). Le process s\'adapte : questions de qualification, ciblage, discours — tout est calibré sur votre activité.' },
              { q: 'Combien de RDV par jour ?', a: 'En moyenne 2 à 5 rendez-vous qualifiés par jour selon l\'activité, la taille du fichier et la complexité de la qualification. On privilégie la qualité au volume brut.' },
              { q: 'Et si les RDV ne sont pas qualifiés ?', a: 'Les questions de qualification sont définies avec vous avant le lancement. Si un RDV ne correspond pas à vos critères, on ajuste le script immédiatement. L\'objectif : zéro RDV inutile.' },
              { q: 'Y a-t-il un engagement ?', a: 'Engagement minimum de 3 mois — le temps d\'optimiser les scripts et de mesurer un vrai ROI. Ensuite, reconduction au mois sans engagement.' },
              { q: 'Pourquoi pas embaucher un SDR plutôt ?', a: 'Un SDR interne coûte ~4 000€/mois chargé (salaire + outils + management) et met 3 mois à être opérationnel. Pour moins que ce budget, vous avez 3 agents formés, encadrés, opérationnels en 7 jours — avec scripts, coaching et reporting inclus.' },
              { q: 'Je peux écouter les appels ?', a: 'Oui. Tous les appels sont enregistrés. Vous pouvez les écouter, les commenter, et nous ajustons les scripts en conséquence. Si vous activez le Dashboard CRM, tout est accessible en temps réel.' },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-white rounded-3xl border border-slate-200 shadow-sm">
                <summary className="flex items-center justify-between cursor-pointer p-5 text-left">
                  <span className="font-bold text-slate-900 text-sm pr-4">{q}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 pt-0"><p className="text-slate-500 text-sm leading-relaxed">{a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="contact" className="py-24 bg-gray-950">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-3 leading-tight">
            Prêt à remplir<br />votre agenda ?
          </h2>
          <p className="text-white/50 mb-8">Envoyez-nous votre fichier. On s&apos;occupe du reste.</p>
          <DiagForm dark />
          <div className="flex flex-wrap justify-center gap-5 mt-6 text-xs text-white/40">
            {['Sans engagement', 'Démarrage en 7 jours', 'Équipe 100% francophone'].map(g => (
              <span key={g} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{g}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CHATBOT */}
      <ChatBot />

      {/* WHATSAPP — juste en dessous du chatbot */}
      <a href="https://wa.me/33767277977?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous."
        target="_blank" rel="noopener noreferrer"
        className="fixed right-5 sm:right-7 bottom-4 sm:bottom-auto sm:top-[calc(50%+50px)] z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        style={{ background: '#25D366' }}>
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* FOOTER */}
      <footer className="bg-gray-950 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <Image src="/logo-icon.png" alt="ScaleWithMike" width={32} height={32} className="rounded-xl" />
              <span className="font-black text-white text-lg tracking-tight">Scale<span className="text-emerald-400">With</span>Mike</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/50">
              {[['#methode', 'Méthode'], ['#resultats', 'Résultats'], ['#pricing', 'Tarifs'], ['#equipe', 'Équipe']].map(([h, l]) => (
                <a key={h} href={h} className="hover:text-emerald-400 transition-colors">{l}</a>
              ))}
              <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">CRM</Link>
            </div>
          </div>
          {/* Divider */}
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30">
            <p>© 2026 ScaleWithMike. Tous droits réservés.</p>
            <a href="mailto:m.simono@groupe-fc.com" className="hover:text-white/60 transition-colors">m.simono@groupe-fc.com</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
