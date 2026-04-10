import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/leads — liste tous les leads
export async function GET() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/leads — crée un lead (formulaire site ou ajout manuel)
export async function POST(req: NextRequest) {
  const body = await req.json()

  const lead = {
    id: `lead-${Date.now()}`,
    prenom: body.prenom || body.firstName || '',
    nom: body.nom || body.lastName || '',
    email: body.email || '',
    telephone: body.telephone || body.phone || '',
    entreprise: body.entreprise || body.company || '',
    secteur: body.secteur || 'BTP',
    source: body.source || 'Site web',
    status: 'nouveau',
    agentId: 'agent-1',
    scoreIA: 5.0,
    caPotentiel: body.caPotentiel || 0,
    dateEntree: new Date().toISOString().split('T')[0],
    derniereAction: new Date().toISOString().split('T')[0],
    notes: body.notes || '',
    historique: [
      {
        id: `h-${Date.now()}`,
        type: 'note',
        label: body.source === 'Manuel' ? 'Lead ajouté manuellement' : 'Lead entrant via ' + (body.source || 'Site web'),
        date: new Date().toISOString().split('T')[0],
        agentId: 'agent-1',
      },
    ],
  }

  const { data, error } = await supabase.from('leads').insert(lead).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
