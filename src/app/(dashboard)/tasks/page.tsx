'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StatsCard from '@/components/shared/StatsCard'
import type { Lead } from '@/lib/types'
import { Phone, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function TasksPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLeads(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const callbacksPending = leads
    .filter(l => ['pas_de_reponse', 'relance_envoyee'].includes(l.status) && !doneIds.has(l.id))
    .sort((a, b) => new Date(b.derniereAction).getTime() - new Date(a.derniereAction).getTime())

  const totalTasks = callbacksPending.length + doneIds.size
  const completedTasks = doneIds.size

  const markDone = async (id: string) => {
    setDoneIds(prev => new Set([...prev, id]))
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'relance_envoyee' }),
    })
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="EN COURS" value={callbacksPending.length} />
        <StatsCard title="TERMINÉES" value={completedTasks} />
        <StatsCard title="TOTAL TÂCHES" value={totalTasks} />
      </div>

      {callbacksPending.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="font-semibold text-slate-900 mb-1">
              {doneIds.size > 0 ? 'Toutes les tâches sont terminées ✓' : 'Aucune relance en attente'}
            </h3>
            <p className="text-sm text-slate-500">
              Les leads à rappeler apparaîtront ici automatiquement
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {callbacksPending.map(lead => {
            const daysSince = Math.floor(
              (Date.now() - new Date(lead.derniereAction).getTime()) / (1000 * 60 * 60 * 24)
            )
            const actionType = lead.status === 'pas_de_reponse' ? 'Première relance' : 'Rappel'
            return (
              <Card key={lead.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-0.5">{lead.prenom} {lead.nom}</h3>
                      <p className="text-xs text-slate-500 mb-2">{lead.entreprise}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{actionType}</Badge>
                        <span className="text-xs text-slate-500">
                          {daysSince === 0 ? "Aujourd'hui" : `Il y a ${daysSince} jour${daysSince > 1 ? 's' : ''}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" className="gap-1"
                        onClick={() => window.open(`tel:${lead.telephone}`)}>
                        <Phone className="w-4 h-4" />Appeler
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1"
                        onClick={() => window.open(`https://wa.me/${lead.telephone.replace(/\D/g, '')}`)}>
                        <MessageCircle className="w-4 h-4" />WhatsApp
                      </Button>
                      <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => markDone(lead.id)}>
                        <CheckCircle2 className="w-4 h-4" />Marquer fait
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
