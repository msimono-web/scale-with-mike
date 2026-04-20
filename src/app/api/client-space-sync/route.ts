import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export async function POST(req: Request) {
  try {
    const { slug, password, allowedEmails, customDomain } = await req.json()
    if (!slug) return NextResponse.json({ error: 'Slug requis' }, { status: 400 })

    const upsertData: Record<string, unknown> = {
      slug,
      allowed_emails: allowedEmails ?? '',
      custom_domain: customDomain ?? null,
      updated_at: new Date().toISOString(),
    }

    // Seulement hasher si un nouveau mot de passe est fourni
    if (password) {
      upsertData.password_hash = crypto.createHash('sha256').update(password).digest('hex')
    }

    const { error } = await supabase
      .from('client_spaces_auth')
      .upsert(upsertData, { onConflict: 'slug' })

    if (error) {
      console.error('Supabase sync error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { slug } = await req.json()
  await supabase.from('client_spaces_auth').delete().eq('slug', slug)
  return NextResponse.json({ ok: true })
}
