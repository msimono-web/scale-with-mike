'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import StatsCard from '@/components/shared/StatsCard'
import { rendezVous as initialRdvs, leads, agents } from '@/lib/data'
import type { RendezVous, RdvStatus } from '@/lib/types'
import { Plus, Link2 } from 'lucide-react'

const RDV_STATUS_LABELS: Record<RdvStatus, string> = {
  prevu: 'Prévu',
  fait: 'Fait',
  no_show: 'No show',
  annule: 'Annulé',
}

const RDV_STATUS_COLORS: Record<RdvStatus, string> = {
  prevu: 'bg-blue-100 text-blue-800',
  fait: 'bg-green-100 text-green-800',
  no_show: 'bg-red-100 text-red-800',
  annule: 'bg-gray-100 text-gray-800',
}

export default function AppointmentsPage() {
  const [rdvs, setRdvs] = useState<RendezVous[]>(initialRdvs)
  const [statusFilter, setStatusFilter] = useState<RdvStatus | 'all'>('all')
  const [isOpen, setIsOpen] = useState(false)

  const filteredRdvs = rdvs.filter((rdv) => statusFilter === 'all' || rdv.status === statusFilter)

  const stats = {
    total: rdvs.length,
    prevu: rdvs.filter((r) => r.status === 'prevu').length,
    fait: rdvs.filter((r) => r.status === 'fait').length,
    noShow: rdvs.filter((r) => r.status === 'no_show').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="TOTAL RDV" value={stats.total} />
        <StatsCard title="PRÉVUS" value={stats.prevu} />
        <StatsCard title="FAITS" value={stats.fait} />
        <StatsCard title="NO SHOW" value={stats.noShow} />
      </div>

      {/* Filter et Bouton Nouveau */}
      <div className="flex items-end gap-4">
        <div className="max-w-xs">
          <Label className="text-sm font-medium text-slate-700 mb-1 block">Statut</Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RdvStatus | 'all')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="prevu">Prévu</SelectItem>
              <SelectItem value="fait">Fait</SelectItem>
              <SelectItem value="no_show">No show</SelectItem>
              <SelectItem value="annule">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 gap-2">
              <Plus className="w-4 h-4" />
              Nouveau RDV
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau rendez-vous</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Lead</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.prenom} {lead.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Heure</Label>
                  <Input type="time" />
                </div>
              </div>

              <div>
                <Label>Durée (minutes)</Label>
                <Input type="number" defaultValue="30" min="15" step="15" />
              </div>

              <div>
                <Label>Lien visio (optionnel)</Label>
                <Input placeholder="https://meet.google.com/..." />
              </div>

              <Button className="w-full">Créer le RDV</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold">DATE</TableHead>
                  <TableHead className="text-xs font-semibold">HEURE</TableHead>
                  <TableHead className="text-xs font-semibold">LEAD</TableHead>
                  <TableHead className="text-xs font-semibold">AGENT</TableHead>
                  <TableHead className="text-xs font-semibold">DURÉE</TableHead>
                  <TableHead className="text-xs font-semibold">STATUT</TableHead>
                  <TableHead className="text-xs font-semibold">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRdvs.map((rdv) => {
                  const lead = leads.find((l) => l.id === rdv.leadId)
                  const agent = agents.find((a) => a.id === rdv.agentId)
                  return (
                    <TableRow key={rdv.id}>
                      <TableCell className="text-sm">{rdv.date}</TableCell>
                      <TableCell className="text-sm">{rdv.heure}</TableCell>
                      <TableCell className="text-sm">
                        {lead && (
                          <div>
                            <p className="font-medium">
                              {lead.prenom} {lead.nom}
                            </p>
                            <p className="text-xs text-slate-500">{lead.email}</p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {agent && (
                          <Badge style={{ backgroundColor: agent.couleur }} className="text-white text-xs">
                            {agent.nom}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{rdv.duree} min</TableCell>
                      <TableCell>
                        <Badge className={RDV_STATUS_COLORS[rdv.status]}>
                          {RDV_STATUS_LABELS[rdv.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {rdv.lienVisio && (
                          <Button size="sm" variant="ghost" className="gap-1">
                            <Link2 className="w-4 h-4" />
                            Visio
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
