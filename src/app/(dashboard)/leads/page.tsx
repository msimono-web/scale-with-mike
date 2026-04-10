'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import StatsCard from '@/components/shared/StatsCard'
import StatusBadge from '@/components/shared/StatusBadge'
import SourceBadge from '@/components/shared/SourceBadge'
import { agents } from '@/lib/data'
import type { Lead, LeadStatus, LeadSource } from '@/lib/types'
import { Search, FileDown, MessageCircle, Mail, Phone, Plus, RefreshCw, Loader2 } from 'lucide-react'

const SECTEURS = ['BTP', 'Immobilier', 'Restauration', 'E-commerce', 'Coaching', 'Santé', 'Juridique', 'Finance']
const SOURCES: LeadSource[] = ['SEO', 'Ads Google', 'Instagram', 'Facebook', 'LinkedIn', 'Referral', 'Manuel']
const STATUTS: LeadStatus[] = ['nouveau', 'a_contacter', 'contacte', 'pas_de_reponse', 'relance_envoyee', 'rdv_pris', 'rdv_fait', 'proposition_envoyee', 'negociation', 'signe', 'perdu']

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    entreprise: '', secteur: 'BTP', source: 'Manuel' as LeadSource,
    caPotentiel: '', notes: '',
  })

  // ─── Fetch leads depuis l'API ─────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      if (res.ok) setLeads(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  // Rafraîchissement automatique toutes les 30s
  useEffect(() => {
    const interval = setInterval(fetchLeads, 30_000)
    return () => clearInterval(interval)
  }, [fetchLeads])

  // ─── Ajouter un lead manuellement ─────────────────────────────────────────
  const handleAddLead = async () => {
    if (!form.prenom) return
    setSaving(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, caPotentiel: parseInt(form.caPotentiel) || 0 }),
      })
      if (res.ok) {
        const newLead = await res.json()
        setLeads(prev => [newLead, ...prev])
        setIsAddOpen(false)
        setForm({ prenom: '', nom: '', email: '', telephone: '', entreprise: '', secteur: 'BTP', source: 'Manuel', caPotentiel: '', notes: '' })
      }
    } finally {
      setSaving(false)
    }
  }

  // ─── Mettre à jour le statut d'un lead ────────────────────────────────────
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l))
      if (selectedLead?.id === leadId) setSelectedLead(updated)
    }
  }

  // ─── Export CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Entreprise', 'Secteur', 'Source', 'Statut', 'CA Potentiel', 'Date Entrée']
    const rows = leads.map(l => [l.prenom, l.nom, l.email, l.telephone, l.entreprise, l.secteur, l.source, l.status, l.caPotentiel, l.dateEntree])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click()
  }

  const filtered = leads.filter(l => {
    const matchSearch = [l.prenom, l.nom, l.email, l.telephone].some(v =>
      v.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchSearch &&
      (statusFilter === 'all' || l.status === statusFilter) &&
      (sourceFilter === 'all' || l.source === sourceFilter)
  })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="TOTAL CONTACTS" value={leads.length} />
        <StatsCard title="LEADS ACTIFS" value={leads.filter(l => !['signe', 'perdu'].includes(l.status)).length} />
        <StatsCard title="RDV PLANIFIÉS" value={leads.filter(l => l.status === 'rdv_pris').length} />
        <StatsCard title="SIGNÉS" value={leads.filter(l => l.status === 'signe').length} />
      </div>

      {/* Barre d'actions */}
      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Recherche</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Nom, email, téléphone…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Statut</label>
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as LeadStatus | 'all')}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {STATUTS.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">Source</label>
          <Select value={sourceFilter} onValueChange={v => setSourceFilter(v as LeadSource | 'all')}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchLeads} variant="outline" size="icon" title="Rafraîchir">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <FileDown className="w-4 h-4" />Export CSV
        </Button>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4" />Nouveau lead
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading && leads.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />Chargement des leads…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg font-medium mb-1">Aucun lead</p>
              <p className="text-sm">Clique sur "Nouveau lead" pour en ajouter un manuellement.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {['PRÉNOM NOM', 'EMAIL', 'TÉLÉPHONE', 'ENTREPRISE', 'SOURCE', 'STATUT', 'CA POTENTIEL', 'DATE'].map(h => (
                      <TableHead key={h} className="text-xs font-semibold">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(lead => (
                    <TableRow key={lead.id} onClick={() => { setSelectedLead(lead); setIsDetailOpen(true) }} className="cursor-pointer hover:bg-slate-50">
                      <TableCell className="font-medium text-sm">{lead.prenom} {lead.nom}</TableCell>
                      <TableCell className="text-sm text-slate-600">{lead.email}</TableCell>
                      <TableCell className="text-sm text-slate-600">{lead.telephone}</TableCell>
                      <TableCell className="text-sm">{lead.entreprise}</TableCell>
                      <TableCell><SourceBadge source={lead.source as LeadSource} /></TableCell>
                      <TableCell><StatusBadge status={lead.status as LeadStatus} /></TableCell>
                      <TableCell className="text-sm font-semibold">{Number(lead.caPotentiel).toLocaleString()}€</TableCell>
                      <TableCell className="text-sm text-slate-500">{lead.dateEntree}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── Modal Détail ─── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLead.prenom} {selectedLead.nom}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div><label className="text-xs font-semibold text-slate-500">EMAIL</label><p className="text-sm">{selectedLead.email}</p></div>
                  <div><label className="text-xs font-semibold text-slate-500">TÉLÉPHONE</label><p className="text-sm">{selectedLead.telephone}</p></div>
                  <div><label className="text-xs font-semibold text-slate-500">ENTREPRISE</label><p className="text-sm">{selectedLead.entreprise}</p></div>
                  <div><label className="text-xs font-semibold text-slate-500">SECTEUR</label><p className="text-sm">{selectedLead.secteur}</p></div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">STATUT</label>
                    <Select value={selectedLead.status} onValueChange={v => handleUpdateStatus(selectedLead.id, v as LeadStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUTS.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><label className="text-xs font-semibold text-slate-500">SOURCE</label><div className="mt-1"><SourceBadge source={selectedLead.source as LeadSource} /></div></div>
                  <div><label className="text-xs font-semibold text-slate-500">CA POTENTIEL</label><p className="text-sm font-semibold">{Number(selectedLead.caPotentiel).toLocaleString()}€</p></div>
                </div>
              </div>
              {selectedLead.notes && (
                <div className="mt-4 pt-4 border-t">
                  <label className="text-xs font-semibold text-slate-500 block mb-1">NOTES</label>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg">{selectedLead.notes}</p>
                </div>
              )}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" className="gap-2 flex-1" onClick={() => window.open(`https://wa.me/${selectedLead.telephone.replace(/\D/g, '')}`)}>
                  <MessageCircle className="w-4 h-4" />WhatsApp
                </Button>
                <Button variant="outline" className="gap-2 flex-1" onClick={() => window.open(`mailto:${selectedLead.email}`)}>
                  <Mail className="w-4 h-4" />Email
                </Button>
                <Button variant="outline" className="gap-2 flex-1" onClick={() => window.open(`tel:${selectedLead.telephone}`)}>
                  <Phone className="w-4 h-4" />Appel
                </Button>
              </div>
              {(selectedLead.historique?.length ?? 0) > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-sm mb-3">Historique</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedLead.historique.map((a: { id: string; label: string; date: string }) => (
                      <div key={a.id} className="text-sm p-2 bg-slate-50 rounded">
                        <p className="font-medium">{a.label}</p>
                        <p className="text-xs text-slate-500">{a.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Modal Nouveau lead ─── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />Nouveau lead
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Prénom *</label>
                <Input placeholder="Jean" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Nom</label>
                <Input placeholder="Dupont" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                <Input placeholder="jean@exemple.fr" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Téléphone</label>
                <Input placeholder="+33 6 00 00 00 00" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Entreprise</label>
              <Input placeholder="Entreprise SAS" value={form.entreprise} onChange={e => setForm(f => ({ ...f, entreprise: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Secteur</label>
                <Select value={form.secteur} onValueChange={v => setForm(f => ({ ...f, secteur: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SECTEURS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Source</label>
                <Select value={form.source} onValueChange={v => setForm(f => ({ ...f, source: v as LeadSource }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">CA potentiel (€)</label>
                <Input placeholder="5000" type="number" value={form.caPotentiel} onChange={e => setForm(f => ({ ...f, caPotentiel: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Notes</label>
              <Textarea placeholder="Informations sur le prospect…" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Annuler</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={handleAddLead} disabled={!form.prenom || saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Ajouter le lead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
