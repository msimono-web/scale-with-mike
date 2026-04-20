'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import StatsCard from '@/components/shared/StatsCard'
import SourceBadge from '@/components/shared/SourceBadge'
import type { Lead, LeadStatus } from '@/lib/types'
import { Search, Loader2 } from 'lucide-react'

const STATUSES: LeadStatus[] = [
  'nouveau', 'a_contacter', 'contacte', 'pas_de_reponse',
  'relance_envoyee', 'rdv_pris', 'negociation', 'signe',
]

const STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: 'NOUVEAU', a_contacter: 'À CONTACTER', contacte: 'CONTACTÉ',
  pas_de_reponse: 'PAS DE RÉPONSE', relance_envoyee: 'RELANCE', rdv_pris: 'RDV PLANIFIÉ',
  rdv_fait: 'RDV FAIT', proposition_envoyee: 'PROPOSITION', negociation: 'NÉGOCIATION',
  signe: 'SIGNÉ', perdu: 'PERDU',
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  nouveau: 'bg-blue-100', a_contacter: 'bg-slate-100', contacte: 'bg-purple-100',
  pas_de_reponse: 'bg-orange-100', relance_envoyee: 'bg-yellow-100', rdv_pris: 'bg-cyan-100',
  rdv_fait: 'bg-green-100', proposition_envoyee: 'bg-pink-100', negociation: 'bg-indigo-100',
  signe: 'bg-green-100', perdu: 'bg-red-100',
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLeads(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredLeads = leads.filter(l =>
    [l.prenom, l.nom, l.email, l.telephone].some(v =>
      (v ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const getLeadsByStatus = (status: LeadStatus) =>
    filteredLeads.filter(l => l.status === status)

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination || source.droppableId === destination.droppableId) return

    const newStatus = destination.droppableId as LeadStatus
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStatus } : l))

    // Persister dans Supabase
    await fetch(`/api/leads/${draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  const total = leads.length
  const nouveaux = leads.filter(l => l.status === 'nouveau').length
  const contactes = leads.filter(l => !['nouveau', 'a_contacter'].includes(l.status)).length
  const rdvPlanifies = leads.filter(l => ['rdv_pris', 'rdv_fait'].includes(l.status)).length
  const signes = leads.filter(l => l.status === 'signe').length

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard title="TOTAL" value={total} />
        <StatsCard title="NOUVEAUX" value={nouveaux} />
        <StatsCard title="CONTACTÉS" value={contactes} />
        <StatsCard title="RDV PLANIFIÉS" value={rdvPlanifies} />
        <StatsCard title="GAGNÉS" value={signes} />
      </div>

      {/* Recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Rechercher un lead…" value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      {leads.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">
          <p className="text-lg font-semibold mb-2">Aucun lead pour l'instant</p>
          <p className="text-sm">Les leads soumis via la landing page apparaîtront ici.</p>
        </Card>
      ) : (
        /* Kanban — scroll horizontal sur mobile */
        <div className="overflow-x-auto pb-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4" style={{ minWidth: `${STATUSES.length * 220}px` }}>
              {STATUSES.map(status => (
                <div key={status} className="flex-shrink-0 w-52">
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}
                        className={`space-y-2 p-3 rounded-lg min-h-[500px] ${snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-slate-100'}`}
                      >
                        <div className={`${STATUS_COLORS[status]} p-2 rounded font-semibold text-xs text-slate-700`}>
                          <div className="flex items-center justify-between">
                            <span>{STATUS_LABELS[status]}</span>
                            <span className="bg-white px-2 py-0.5 rounded text-xs font-bold">
                              {getLeadsByStatus(status).length}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {getLeadsByStatus(status).map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                  className={`bg-white p-3 rounded-lg border border-slate-200 cursor-move transition-all ${snapshot.isDragging ? 'shadow-lg rotate-1' : 'shadow-sm'}`}
                                >
                                  <p className="font-medium text-sm text-slate-900">{lead.prenom} {lead.nom}</p>
                                  {lead.entreprise && <p className="text-xs text-slate-500 mt-0.5">{lead.entreprise}</p>}
                                  <p className="text-xs text-slate-400 mt-0.5 truncate">{lead.email || lead.telephone}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <SourceBadge source={lead.source} />
                                    {lead.caPotentiel > 0 && (
                                      <span className="text-xs font-semibold text-slate-700">{lead.caPotentiel.toLocaleString()}€</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
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
      )}
    </div>
  )
}
