import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

function sha256(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(req: Request) {
  try {
    const { slug, password, googleEmail } = await req.json()
    if (!slug) return NextResponse.json({ error: 'Slug requis' }, { status: 400 })

    // Récupérer les infos auth du client
    const { data: auth, error } = await supabase
      .from('client_spaces_auth')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !auth) {
      return NextResponse.json({ error: 'Espace client introuvable' }, { status: 404 })
    }

    let authorized = false

    if (googleEmail) {
      // Auth Google : vérifier que l'email est autorisé
      const allowed = (auth.allowed_emails ?? '').split(',').map((e: string) => e.trim().toLowerCase())
      if (allowed.includes(googleEmail.toLowerCase())) {
        authorized = true
      }
    } else if (password) {
      // Auth mot de passe
      const hash = sha256(password)
      if (hash === auth.password_hash) authorized = true
    }

    if (!authorized) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })
    }

    // Créer une session
    const token = generateToken()
    await supabase.from('client_sessions').insert({
      token,
      slug,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    const res = NextResponse.json({ ok: true })
    res.cookies.set(`swm-client-${slug}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: `/client/${slug}`,
      maxAge: 7 * 24 * 60 * 60,
    })
    return res

  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
