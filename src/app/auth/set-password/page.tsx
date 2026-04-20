'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'key'
  )

  async function handleSubmit() {
    if (password.length < 8) { setError('Mot de passe trop court (8 caractères min.)'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-black mb-2 text-slate-900">Créer votre mot de passe</h1>
        <p className="text-slate-400 text-sm mb-6">Choisissez un mot de passe pour accéder au dashboard ScaleWithMike.</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="password"
          placeholder="Nouveau mot de passe (8 car. min.)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-4 text-sm outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest disabled:opacity-60"
          style={{ background: '#0a1aff', color: '#fde68a' }}
        >
          {loading ? 'Enregistrement…' : 'Accéder au dashboard →'}
        </button>
      </div>
    </div>
  )
}
