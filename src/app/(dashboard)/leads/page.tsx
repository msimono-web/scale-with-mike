'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import StatusBadge from '@/components/shared/StatusBadge'
import SourceBadge from '@/components/shared/SourceBadge'
import { leads as initialLeads, agents, getKPIs } from '@/lib/data'
import type { Lead, LeadStatus, LeadSource, LeadSector } from '@/lib/types'
import { Search, FileDown, MessageCircle, Mail, Phone } from 'lucide-react'

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const kpis = getKPIs()

  const filteredLeads = initialLeads.filter((lead) => {
    const matchesSearch =
      lead.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter

    return matchesSearch && matchesStatus && matchesSource
  })

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsDetailOpen(true)
  }

  const handleExportCSV = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Secteur', 'Source', 'Statut', 'Score IA', 'CA Potentiel', 'Agent']
    const rows = initialLeads.map((l) => {
      const agent = agents.find((a) => a.id === l.agentId)
      return [
        l.prenom,
        l.nom,
        l.email,
        l.telephone,
        l.secteur,
        l.source,
        l.status,
        l.scoreIA,
        l.caPotentiel,
        agent?.nom || '',
      ]
    })

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="TOTAL CONTACTS" value={initialLeads.length} />
        <StatsCard title="LEADS" value={initialLeads.filter((l) => !['signe', 'perdu'].includes(l.status)).length} />
        <StatsCard title="RDV PLANIFIÉS" value={initialLeads.filter((l) => l.status === 'rdv_pris').length} />
        <StatsCard title="SIGNÉS" value={initialLeads.filter((l) => l.status === 'signe').length} />
      </div>

      {/* Filtres et recherche */}
      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-md">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Recherche</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-w-xs">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Statut</label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | 'all')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="contacte">Contacté</SelectItem>
              <SelectItem value="rdv_pris">RDV Planifié</SelectItem>
              <SelectItem value="signe">Signé</SelectItem>
              <SelectItem value="perdu">Perdu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="max-w-xs">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Source</label>
          <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as LeadSource | 'all')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="SEO">SEO</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold">PRÉNOM NOM</TableHead>
                  <TableHead className="text-xs font-semibold">EMAIL</TableHead>
                  <TableHead className="text-xs font-semibold">TÉLÉPHONE</TableHead>
                  <TableHead className="text-xs font-semibold">SECTEUR</TableHead>
                  <TableHead className="text-xs font-semibold">SOURCE</TableHead>
                  <TableHead className="text-xs font-semibold">STATUT</TableHead>
                  <TableHead className="text-xs font-semibold">SCORE IA</TableHead>
                  <TableHead className="text-xs font-semibold">CA POTENTIEL</TableHead>
                  <TableHead className="text-xs font-semibold">AGENT</TableHead>
                  <TableHead className="text-xs font-semibold">DATE ENTRÉE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const agent = agents.find((a) => a.id === lead.agentId)
                  return (
                    <TableRow
                      key={lead.id}
                      onClick={() => handleLeadClick(lead)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <TableCell className="text-sm font-medium">
                        {lead.prenom} {lead.nom}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{lead.email}</TableCell>
                      <TableCell className="text-sm text-slate-600">{lead.telephone}</TableCell>
                      <TableCell className="text-sm">{lead.secteur}</TableCell>
                      <TableCell>
                        <SourceBadge source={lead.source} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={lead.status} />
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-blue-600">{lead.scoreIA.toFixed(1)}</TableCell>
                      <TableCell className="text-sm font-semibold">{lead.caPotentiel.toLocaleString()}€</TableCell>
                      <TableCell>
                        {agent && (
                          <Badge style={{ backgroundColor: agent.couleur }} className="text-white text-xs">
                            {agent.nom}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{lead.dateEntree}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedLead.prenom} {selectedLead.nom}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">EMAIL</label>
                    <p className="text-sm font-medium">{selectedLead.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">TÉLÉPHONE</label>
                    <p className="text-sm font-medium">{selectedLead.telephone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">ENTREPRISE</label>
                    <p className="text-sm font-medium">{selectedLead.entreprise}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">SECTEUR</label>
                    <p className="text-sm font-medium">{selectedLead.secteur}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">STATUT</label>
                    <StatusBadge status={selectedLead.status} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">SOURCE</label>
                    <SourceBadge source={selectedLead.source} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">SCORE IA</label>
                    <p className="text-sm font-semibold text-blue-600">{selectedLead.scoreIA.toFixed(1)}/10</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">CA POTENTIEL</label>
                    <p className="text-sm font-semibold">{selectedLead.caPotentiel.toLocaleString()}€</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-6 border-t">
                <Button variant="outline" className="gap-2 flex-1">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="gap-2 flex-1">
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button variant="outline" className="gap-2 flex-1">
                  <Phone className="w-4 h-4" />
                  Appel
                </Button>
              </div>

              {/* Historique */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-sm mb-3">Historique</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedLead.historique.map((action) => (
                    <div key={action.id} className="text-sm p-2 bg-slate-50 rounded">
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-slate-500">{action.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
