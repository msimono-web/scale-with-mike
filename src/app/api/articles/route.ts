import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/articles — list all articles
export async function GET() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/articles — create article
export async function POST(req: NextRequest) {
  const body = await req.json()

  const contenu = body.contenu || ''
  const mots = contenu.split(/\s+/).filter(Boolean).length

  const article = {
    id: `art-${Date.now()}`,
    titre: body.titre || 'Nouvel article',
    slug: body.slug || `article-${Date.now()}`,
    cluster: body.cluster || 'Prospection',
    secteur: body.secteur || 'Général',
    status: body.status || 'brouillon',
    meta_description: body.meta_description || '',
    extrait: body.extrait || '',
    contenu,
    mots,
    score_global: body.score_global || 0,
    score_seo: body.score_seo || 0,
    score_unicite: body.score_unicite || 0,
    score_specificite: body.score_specificite || 0,
    score_voix: body.score_voix || 0,
    score_actionabilite: body.score_actionabilite || 0,
    vues: 0,
    clics_cta: 0,
    leads_generes: 0,
    taux_conversion: 0,
    temps_lecture_moy: 0,
    taux_rebond: 0,
    keywords: body.keywords || [],
    generated_from: body.generated_from || null,
    generation_prompt: body.generation_prompt || null,
  }

  const { data, error } = await supabase.from('articles').insert(article).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
