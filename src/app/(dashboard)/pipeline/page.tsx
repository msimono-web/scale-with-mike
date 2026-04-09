'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import SourceBadge from '@/components/shared/SourceBadge'
import { leads as initialLeads, agents, getKPIs } from '@/lib/data'
import type { Lead, LeadStatus } from '@/lib/types'
import { Search } from 'lucide-react'

const STATUSES: LeadStatus[] = [
  'nouveau',
  'a_contacter',
  'contacte',
  'pas_de_reponse',
  'relance_envoyee',
  'rdv_pris',
  'negociation',
  'signe',
]

const STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: 'NOUVEAU',
  a_contacter: 'À CONTACTER',
  contacte: 'CONTACTÉ',
  pas_de_reponse: 'PAS DE RÉPONSE',
  relance_envoyee: 'RELANCE ENVOYÉE',
  rdv_pris: 'RDV PLANIFIÉ',
  rdv_fait: 'RDV FAIT',
  proposition_envoyee: 'PROPOSITION',
  negociation: 'NÉGOCIATION',
  signe: 'SIGNÉ',
  perdu: 'PERDU',
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  nouveau: 'bg-blue-100',
  a_contacter: 'bg-slate-100',
  contacte: 'bg-purple-100',
  pas_de_reponse: 'bg-orange-100',
  relance_envoyee: 'bg-yellow-100',
  rdv_pris: 'bg-cyan-100',
  rdv_fait: 'bg-green-100',
  proposition_envoyee: 'bg-pink-100',
  negociation: 'bg-indigo-100',
  signe: 'bg-green-100',
  perdu: 'bg-red-100',
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchTerm, setSearchTerm] = useState('')
  const kpis = getKPIs()

  const filteredLeads = leads.filter(
    (l) =>
      l.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getLeadsByStatus = (status: LeadStatus): Lead[] => {
    return filteredLeads.filter((l) => l.status === status)
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const lead = leads.find((l) => l.id === draggableId)
    if (!lead) return

    const newStatus = destination.droppableId as LeadStatus
    const updatedLeads = leads.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))

    setLeads(updatedLeads)
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatsCard title="TOTAL" value={kpis.total} />
        <StatsCard title="NOUVEAUX" value={kpis.nouveaux} />
        <StatsCard title="CONTACTÉS" value={kpis.contactes} />
        <StatsCard title="RDV PLANIFIÉS" value={kpis.rdvPlanifies} />
        <StatsCard title="GAGNÉS" value={kpis.signes} />
      </div>

      {/* Recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Rechercher un lead..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-8 gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <div key={status} className="flex-shrink-0 w-80">
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 p-3 rounded-lg min-h-[600px] ${
                      snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-slate-100'
                    }`}
                  >
                    {/* Header */}
                    <div className={`${STATUS_COLORS[status]} p-2 rounded font-semibold text-xs text-slate-700`}>
                      <div className="flex items-center justify-between">
                        <span>{STATUS_LABELS[status]}</span>
                        <span className="bg-white px-2 py-1 rounded text-xs font-bold">
                          {getLeadsByStatus(status).length}
                        </span>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="space-y-2">
                      {getLeadsByStatus(status).map((lead, index) => {
                        const agent = agents.find((a) => a.id === lead.agentId)
                        return (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white p-3 rounded-lg border border-slate-200 cursor-move transition-all ${
                                  snapshot.isDragging ? 'shadow-lg rotate-3' : 'shadow-sm'
                                }`}
                              >
                                <p className="font-medium text-sm text-slate-900">
                                  {lead.prenom} {lead.nom}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{lead.entreprise}</p>
                                <p className="text-xs text-slate-400 mt-1 truncate">{lead.email}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <SourceBadge source={lead.source} />
                                  {agent && (
                                    <Badge
                                      style={{ backgroundColor: agent.couleur }}
                                      className="text-white text-xs"
                                    >
                                      {agent.nom.split(' ')[0]}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs font-semibold mt-2 text-slate-700">
                                  {lead.caPotentiel.toLocaleString()}€
                                </p>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
