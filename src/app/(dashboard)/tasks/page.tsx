'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StatsCard from '@/components/shared/StatsCard'
import { leads, agents } from '@/lib/data'
import { Phone, MessageCircle, CheckCircle2 } from 'lucide-react'

export default function TasksPage() {
  // Callbacks en attente (leads à rappeler)
  const callbacksPending = leads
    .filter((l) => ['pas_de_reponse', 'relance_envoyee'].includes(l.status))
    .sort((a, b) => new Date(b.derniereAction).getTime() - new Date(a.derniereAction).getTime())

  const totalTasks = callbacksPending.length
  const completedTasks = 0 // Simulation
  const remainingSteps = totalTasks - completedTasks

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard title="EN COURS" value={totalTasks} />
        <StatsCard title="TERMINÉES" value={completedTasks} />
        <StatsCard title="STEPS RESTANTS" value={remainingSteps} />
      </div>

      {/* Empty state ou liste de tâches */}
      {callbacksPending.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-slate-400 mb-4">
              <MessageCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Aucun lead assigné</h3>
            <p className="text-sm text-slate-500">
              Les leads apparaîtront ici quand ils seront assignés
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {callbacksPending.map((lead) => {
            const agent = agents.find((a) => a.id === lead.agentId)
            const daysSince = Math.floor(
              (Date.now() - new Date(lead.derniereAction).getTime()) / (1000 * 60 * 60 * 24)
            )
            const actionType =
              lead.status === 'pas_de_reponse' ? 'Première relance' : 'Rappel'

            return (
              <Card key={lead.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">
                        {lead.prenom} {lead.nom}
                      </h3>
                      <p className="text-xs text-slate-500 mb-2">{lead.entreprise}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {actionType}
                        </Badge>
                        <span className="text-xs text-slate-500">Il y a {daysSince} jours</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {agent && (
                        <Badge
                          style={{ backgroundColor: agent.couleur }}
                          className="text-white text-xs"
                        >
                          {agent.nom.split(' ')[0]}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Phone className="w-4 h-4" />
                        Appeler
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                      <Button size="sm" className="gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Marquer fait
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
