import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export const dynamic = 'force-dynamic'

// GET — Récupérer tous les espaces clients
export async function GET() {
  const { data, error } = await supabase
    .from('client_spaces')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    // Si la table n'existe pas encore, retourner un tableau vide
    if (error.code === '42P01') return NextResponse.json([])
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data || [])
}

// POST — Créer ou mettre à jour un espace client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const space = {
      id: body.id || `cs-${Date.now()}`,
      slug: body.slug,
      company_name: body.companyName || '',
      activity: body.activity || '',
      description: body.description || '',
      primary_color: body.primaryColor || '#3b82f6',
      secondary_color: body.secondaryColor || '#10b981',
      logo_url: body.logoUrl || '',
      hero_title: body.heroTitle || '',
      hero_subtitle: body.heroSubtitle || '',
      cta_text: body.ctaText || '',
      calendly_url: body.calendlyUrl || '',
      password_hash: body.passwordHash || null,
      allowed_emails: body.allowedEmails || '',
      custom_domain: body.customDomain || null,
      vercel_domain_id: body.vercelDomainId || null,
      created_at: body.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('client_spaces')
      .upsert(space, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.error('Client space upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    console.error('Client spaces POST error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE — Supprimer un espace client
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 })

    await supabase.from('client_spaces').delete().eq('id', id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Client spaces DELETE error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
