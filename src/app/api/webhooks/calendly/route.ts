import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * POST /api/webhooks/calendly
 * Reçoit les événements Calendly (invitee.created) et crée un lead automatiquement.
 *
 * Calendly envoie un payload avec :
 * - event: "invitee.created" | "invitee.canceled"
 * - payload.invitee.name, .email, .text_reminder_number (phone)
 * - payload.questions_and_answers (custom questions)
 * - payload.event_type.name (type de RDV)
 * - payload.scheduled_event.start_time
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const event = body.event
    const payload = body.payload

    // On ne traite que les créations de RDV
    if (event !== 'invitee.created') {
      return NextResponse.json({ message: 'Event ignoré', event }, { status: 200 })
    }

    // Extraction des infos de l'invité
    const invitee = payload?.invitee || {}
    const scheduledEvent = payload?.scheduled_event || payload?.event || {}
    const questionsAndAnswers = payload?.questions_and_answers || []

    // Extraire le nom (split prénom / nom)
    const fullName = invitee.name || ''
    const nameParts = fullName.trim().split(/\s+/)
    const prenom = nameParts[0] || ''
    const nom = nameParts.slice(1).join(' ') || ''

    const email = invitee.email || ''
    const telephone = invitee.text_reminder_number || ''

    // Chercher entreprise et secteur dans les questions personnalisées
    let entreprise = ''
    let secteur = ''
    let notes = ''

    for (const qa of questionsAndAnswers) {
      const question = (qa.question || '').toLowerCase()
      const answer = qa.answer || ''

      if (question.includes('entreprise') || question.includes('société') || question.includes('company')) {
        entreprise = answer
      } else if (question.includes('secteur') || question.includes('activité') || question.includes('industry')) {
        secteur = answer
      } else {
        // Stocker les autres réponses en notes
        notes += `${qa.question}: ${answer}\n`
      }
    }

    // Vérifier si le lead existe déjà (par email)
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, historique')
      .eq('email', email)
      .maybeSingle()

    if (existingLead) {
      // Lead existant → ajouter l'événement dans l'historique
      const historique = Array.isArray(existingLead.historique) ? existingLead.historique : []
      historique.push({
        id: `h-${Date.now()}`,
        type: 'rdv',
        label: `RDV Calendly pris — ${scheduledEvent.name || 'Rendez-vous'}`,
        date: new Date().toISOString().split('T')[0],
        agentId: 'agent-1',
      })

      await supabase
        .from('leads')
        .update({
          status: 'rdv_pris',
          derniereAction: new Date().toISOString().split('T')[0],
          historique,
        })
        .eq('id', existingLead.id)

      return NextResponse.json({ message: 'Lead existant mis à jour', id: existingLead.id }, { status: 200 })
    }

    // Nouveau lead
    const lead = {
      id: `lead-${Date.now()}`,
      prenom,
      nom,
      email,
      telephone,
      entreprise,
      secteur: secteur || 'À qualifier',
      source: 'Calendly',
      status: 'rdv_pris',
      agentId: 'agent-1',
      scoreIA: 7.0,
      caPotentiel: 0,
      dateEntree: new Date().toISOString().split('T')[0],
      derniereAction: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
      historique: [
        {
          id: `h-${Date.now()}`,
          type: 'rdv',
          label: `RDV Calendly pris — ${scheduledEvent.name || 'Rendez-vous'}`,
          date: new Date().toISOString().split('T')[0],
          agentId: 'agent-1',
        },
      ],
    }

    const { data, error } = await supabase.from('leads').insert(lead).select().single()

    if (error) {
      console.error('Erreur insertion lead Calendly:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Lead créé depuis Calendly', id: data.id }, { status: 201 })
  } catch (err: unknown) {
    console.error('Webhook Calendly erreur:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
