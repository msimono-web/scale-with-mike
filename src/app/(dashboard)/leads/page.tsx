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
import type { Lead, LeadStatus, LeadSource, LeadAction, LeadReminder, ReminderType } from '@/lib/types'
import { Label } from '@/components/ui/label'
import { Search, FileDown, MessageCircle, Mail, Phone, Plus, RefreshCw, Loader2, Calendar, FileText, CreditCard, Send, Clock, CheckCircle2, AlertTriangle, Pencil, BellRing, Trash2 } from 'lucide-react'

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
  const [ficheTab, setFicheTab] = useState('info')

  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    entreprise: '', secteur: 'BTP', source: 'Manuel' as LeadSource,
    caPotentiel: '', notes: '',
  })

  // ─── Fetch leads depuis l'API ─────────────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads', { signal: AbortSignal.timeout(15000) })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) setLeads(data)
      }
    } catch (e) {
      console.error('Fetch leads error:', e)
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
      (v || '').toLowerCase().includes(searchTerm.toLowerCase()))
    return matchSearch &&
      (statusFilter === 'all' || l.status === statusFilter) &&
      (sourceFilter === 'all' || l.source === sourceFilter)
  })

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="TOTAL CONTACTS" value={leads.length} />
        <StatsCard title="LEADS ACTIFS" value={leads.filter(l => !['signe', 'perdu'].includes(l.status)).length} />
        <StatsCard title="RDV PLANIFIÉS" value={leads.filter(l => l.status === 'rdv_pris').length} />
        <StatsCard title="SIGNÉS" value={leads.filter(l => l.status === 'signe').length} />
      </div>

      {/* Barre d'actions */}
      <div className="space-y-3">
        {/* Ligne 1 : Recherche */}
        <div className="flex gap-2 sm:gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[160px] sm:min-w-[200px]">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Nom, email, tél…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="w-[130px] sm:w-auto">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Statut</label>
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v as LeadStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {STATUTS.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:block">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Source</label>
            <Select value={sourceFilter} onValueChange={v => setSourceFilter(v as LeadSource | 'all')}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Ligne 2 : Boutons d'action */}
        <div className="flex gap-2 items-center flex-wrap">
          {/* Source filter on mobile */}
          <div className="sm:hidden">
            <Select value={sourceFilter} onValueChange={v => setSourceFilter(v as LeadSource | 'all')}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={fetchLeads} variant="outline" size="icon" title="Rafraîchir">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 hidden sm:flex">
            <FileDown className="w-4 h-4" />Export CSV
          </Button>
          <Button onClick={handleExportCSV} variant="outline" size="icon" className="sm:hidden" title="Export CSV">
            <FileDown className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white ml-auto">
            <Plus className="w-4 h-4" /><span className="hidden sm:inline">Nouveau lead</span><span className="sm:hidden">Ajouter</span>
          </Button>
        </div>
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
                    <TableRow key={lead.id} onClick={() => { setSelectedLead(lead); setFicheTab('info'); setIsDetailOpen(true) }} className="cursor-pointer hover:bg-slate-50">
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

      {/* ─── FICHE LEAD COMPLÈTE ─── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-0 w-[calc(100vw-1rem)] sm:w-auto rounded-xl">
          {selectedLead && (() => {
            return (
              <>
                {/* Header card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 sm:py-5 text-white">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center text-base sm:text-xl font-black flex-shrink-0">
                      {(selectedLead.prenom || '?')[0]}{(selectedLead.nom || '')[0] || ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base sm:text-xl font-bold truncate">{selectedLead.prenom} {selectedLead.nom}</h2>
                      {selectedLead.entreprise && <p className="text-white/70 text-sm">{selectedLead.entreprise} · {selectedLead.secteur}</p>}
                      <div className="flex gap-2 mt-2">
                        <StatusBadge status={selectedLead.status as LeadStatus} />
                        <SourceBadge source={selectedLead.source as LeadSource} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">CA Potentiel</p>
                      <p className="text-2xl font-black">{Number(selectedLead.caPotentiel).toLocaleString()}€</p>
                      <p className="text-white/60 text-xs mt-1">Score IA : {selectedLead.scoreIA}/10</p>
                    </div>
                  </div>
                  {/* Quick actions */}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => window.open(`tel:${selectedLead.telephone}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-medium transition-colors">
                      <Phone className="w-3 h-3" /> Appeler
                    </button>
                    <button onClick={() => window.open(`https://wa.me/${selectedLead.telephone.replace(/\D/g, '')}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-medium transition-colors">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </button>
                    <button onClick={() => window.open(`mailto:${selectedLead.email}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-medium transition-colors">
                      <Mail className="w-3 h-3" /> Email
                    </button>
                  </div>
                </div>

                {/* Tabs — scrollable on mobile */}
                <div className="flex border-b border-slate-200 px-3 sm:px-6 bg-white overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'info', label: 'Info', labelFull: 'Informations', icon: <FileText className="w-3.5 h-3.5" /> },
                    { id: 'historique', label: 'Échanges', labelFull: 'Échanges', icon: <Clock className="w-3.5 h-3.5" /> },
                    { id: 'rappels', label: 'Rappels', labelFull: 'Rappels', icon: <BellRing className="w-3.5 h-3.5" /> },
                    { id: 'com', label: 'Com', labelFull: 'Communication', icon: <Send className="w-3.5 h-3.5" /> },
                    { id: 'docs', label: 'Docs', labelFull: 'Devis & Factures', icon: <CreditCard className="w-3.5 h-3.5" /> },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setFicheTab(tab.id)}
                      className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-3 text-[11px] sm:text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                        ficheTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}>
                      {tab.icon} <span className="sm:hidden">{tab.label}</span><span className="hidden sm:inline">{tab.labelFull}</span>
                    </button>
                  ))}
                </div>

                <div className="px-4 sm:px-6 py-4 sm:py-5">
                  {/* ── INFO TAB ──────────────── */}
                  {ficheTab === 'info' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                          <p className="text-sm mt-0.5">{selectedLead.email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Téléphone</p>
                          <p className="text-sm mt-0.5">{selectedLead.telephone || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Entreprise</p>
                          <p className="text-sm mt-0.5">{selectedLead.entreprise || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Secteur</p>
                          <p className="text-sm mt-0.5">{selectedLead.secteur}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Date d&apos;entrée</p>
                          <p className="text-sm mt-0.5">{selectedLead.dateEntree}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Dernière action</p>
                          <p className="text-sm mt-0.5">{selectedLead.derniereAction}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Statut</p>
                        <Select value={selectedLead.status} onValueChange={v => handleUpdateStatus(selectedLead.id, v as LeadStatus)}>
                          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>{STATUTS.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>

                      {selectedLead.notes && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Notes</p>
                          <p className="text-sm bg-slate-50 p-3 rounded-xl">{selectedLead.notes}</p>
                        </div>
                      )}

                      {/* Add note */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ajouter une note</p>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ex: A rappelé, intéressé par le pack 5 agents..."
                            id="new-note-input"
                            className="flex-1 text-sm"
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement
                                const val = input.value.trim()
                                if (!val) return
                                const newAction: LeadAction = { id: `h-${Date.now()}`, type: 'note', label: val, date: new Date().toISOString().split('T')[0], agentId: 'agent-1' }
                                const hist: LeadAction[] = [...(selectedLead.historique || []), newAction]
                                await fetch(`/api/leads/${selectedLead.id}`, {
                                  method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ historique: hist }),
                                })
                                setSelectedLead({ ...selectedLead, historique: hist })
                                setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, historique: hist } : l))
                                input.value = ''
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── ÉCHANGES / HISTORIQUE TAB ─ */}
                  {ficheTab === 'historique' && (
                    <div className="space-y-3">
                      {(!selectedLead.historique || selectedLead.historique.length === 0) ? (
                        <div className="text-center py-10 text-slate-400">
                          <Clock className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                          <p className="text-sm font-medium">Aucun échange enregistré</p>
                          <p className="text-xs">Les notes, appels et actions apparaîtront ici</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                          {[...(selectedLead.historique || [])].reverse().map((a: { id: string; type: string; label: string; date: string; agentId?: string }) => {
                            const typeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
                              appel: { color: 'bg-blue-100 text-blue-600', icon: <Phone className="w-3 h-3" /> },
                              email: { color: 'bg-purple-100 text-purple-600', icon: <Mail className="w-3 h-3" /> },
                              whatsapp: { color: 'bg-green-100 text-green-600', icon: <MessageCircle className="w-3 h-3" /> },
                              rdv: { color: 'bg-amber-100 text-amber-600', icon: <Calendar className="w-3 h-3" /> },
                              note: { color: 'bg-slate-100 text-slate-600', icon: <Pencil className="w-3 h-3" /> },
                              statut: { color: 'bg-emerald-100 text-emerald-600', icon: <CheckCircle2 className="w-3 h-3" /> },
                            }
                            const tc = typeConfig[a.type] || typeConfig.note
                            return (
                              <div key={a.id} className="flex gap-3 pb-4 relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${tc.color}`}>
                                  {tc.icon}
                                </div>
                                <div className="flex-1 bg-slate-50 rounded-xl p-3 min-w-0">
                                  <p className="text-sm text-slate-700">{a.label}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">{a.date}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Quick add action */}
                      <div className="flex gap-2 pt-3 border-t border-slate-200">
                        {[
                          { type: 'appel', label: 'Appel', icon: <Phone className="w-3 h-3" /> },
                          { type: 'email', label: 'Email', icon: <Mail className="w-3 h-3" /> },
                          { type: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-3 h-3" /> },
                          { type: 'rdv', label: 'RDV', icon: <Calendar className="w-3 h-3" /> },
                        ].map(action => (
                          <Button key={action.type} size="sm" variant="outline" className="gap-1 text-xs flex-1"
                            onClick={async () => {
                              const label = prompt(`Détail de l'action "${action.label}" :`)
                              if (!label) return
                              const newAction: LeadAction = { id: `h-${Date.now()}`, type: action.type as LeadAction['type'], label: `${action.label} : ${label}`, date: new Date().toISOString().split('T')[0], agentId: 'agent-1' }
                              const hist: LeadAction[] = [...(selectedLead.historique || []), newAction]
                              await fetch(`/api/leads/${selectedLead.id}`, {
                                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ historique: hist }),
                              })
                              setSelectedLead({ ...selectedLead, historique: hist })
                              setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, historique: hist } : l))
                            }}>
                            {action.icon} {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── RAPPELS TAB ─────────── */}
                  {ficheTab === 'rappels' && (
                    <div className="space-y-4">
                      {/* Formulaire nouveau rappel */}
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-700 uppercase mb-3 flex items-center gap-1.5"><BellRing className="w-3.5 h-3.5" /> Programmer un rappel</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Type</label>
                            <select id="rappel-type" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
                              <option value="appel">📞 Appeler</option>
                              <option value="email">📧 Envoyer email</option>
                              <option value="relance">🔄 Relancer</option>
                              <option value="rdv">📅 RDV</option>
                              <option value="autre">📝 Autre</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date</label>
                            <input id="rappel-date" type="date" defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Heure</label>
                            <input id="rappel-heure" type="time" defaultValue="09:00" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Note</label>
                            <input id="rappel-label" type="text" placeholder="Ex: Rappeler pour devis..." className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white" />
                          </div>
                        </div>
                        <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white gap-1.5 w-full"
                          onClick={async () => {
                            const typeEl = document.getElementById('rappel-type') as HTMLSelectElement
                            const dateEl = document.getElementById('rappel-date') as HTMLInputElement
                            const heureEl = document.getElementById('rappel-heure') as HTMLInputElement
                            const labelEl = document.getElementById('rappel-label') as HTMLInputElement
                            if (!dateEl.value) return
                            const newRappel: LeadReminder = {
                              id: `r-${Date.now()}`,
                              type: typeEl.value as ReminderType,
                              label: labelEl.value || typeEl.options[typeEl.selectedIndex].text,
                              date: dateEl.value,
                              heure: heureEl.value || '09:00',
                              done: false,
                              agentId: 'agent-1',
                            }
                            const rappels: LeadReminder[] = [...(selectedLead.rappels || []), newRappel]
                            await fetch(`/api/leads/${selectedLead.id}`, {
                              method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ rappels }),
                            })
                            setSelectedLead({ ...selectedLead, rappels })
                            setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, rappels } : l))
                            labelEl.value = ''
                          }}>
                          <BellRing className="w-3.5 h-3.5" /> Ajouter le rappel
                        </Button>
                      </div>

                      {/* Quick presets */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Rappel rapide</p>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { label: 'Dans 1h', offset: 3600000 },
                            { label: 'Demain 9h', offset: 0, tomorrow: true },
                            { label: 'Dans 3 jours', offset: 3 * 86400000 },
                            { label: 'Dans 1 semaine', offset: 7 * 86400000 },
                          ].map(preset => (
                            <button key={preset.label} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium"
                              onClick={async () => {
                                const now = new Date()
                                let targetDate: Date
                                if (preset.tomorrow) {
                                  targetDate = new Date(now)
                                  targetDate.setDate(targetDate.getDate() + 1)
                                  targetDate.setHours(9, 0, 0, 0)
                                } else {
                                  targetDate = new Date(now.getTime() + preset.offset)
                                }
                                const newRappel: LeadReminder = {
                                  id: `r-${Date.now()}`,
                                  type: 'relance',
                                  label: `Relance — ${preset.label}`,
                                  date: targetDate.toISOString().split('T')[0],
                                  heure: `${String(targetDate.getHours()).padStart(2, '0')}:${String(targetDate.getMinutes()).padStart(2, '0')}`,
                                  done: false,
                                  agentId: 'agent-1',
                                }
                                const rappels: LeadReminder[] = [...(selectedLead.rappels || []), newRappel]
                                await fetch(`/api/leads/${selectedLead.id}`, {
                                  method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ rappels }),
                                })
                                setSelectedLead({ ...selectedLead, rappels })
                                setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, rappels } : l))
                              }}>
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Liste des rappels */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Rappels programmés</p>
                        {(!selectedLead.rappels || selectedLead.rappels.length === 0) ? (
                          <div className="text-center py-8 text-slate-400">
                            <BellRing className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                            <p className="text-sm font-medium">Aucun rappel programmé</p>
                            <p className="text-xs">Programmez un rappel pour ne jamais oublier un lead</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {[...(selectedLead.rappels || [])].sort((a, b) => `${a.date}T${a.heure}`.localeCompare(`${b.date}T${b.heure}`)).map(r => {
                              const isToday = r.date === new Date().toISOString().split('T')[0]
                              const isPast = new Date(`${r.date}T${r.heure}`) < new Date()
                              const isOverdue = isPast && !r.done
                              return (
                                <div key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                  r.done ? 'bg-slate-50 border-slate-100 opacity-60' :
                                  isOverdue ? 'bg-red-50 border-red-200' :
                                  isToday ? 'bg-amber-50 border-amber-200' :
                                  'bg-white border-slate-200'
                                }`}>
                                  <button
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                      r.done ? 'bg-green-500 border-green-500 text-white' :
                                      isOverdue ? 'border-red-400 hover:bg-red-100' :
                                      'border-slate-300 hover:bg-blue-100'
                                    }`}
                                    onClick={async () => {
                                      const rappels: LeadReminder[] = (selectedLead.rappels || []).map(
                                        rem => rem.id === r.id ? { ...rem, done: !rem.done } : rem
                                      )
                                      await fetch(`/api/leads/${selectedLead.id}`, {
                                        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ rappels }),
                                      })
                                      setSelectedLead({ ...selectedLead, rappels })
                                      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, rappels } : l))
                                    }}>
                                    {r.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${r.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{r.label}</p>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5" />
                                      {r.date} à {r.heure}
                                      {isOverdue && <span className="text-red-500 font-bold ml-1">· EN RETARD</span>}
                                      {isToday && !isPast && !r.done && <span className="text-amber-600 font-bold ml-1">· AUJOURD&apos;HUI</span>}
                                    </p>
                                  </div>
                                  <button className="p-1.5 rounded-lg hover:bg-red-100 text-slate-300 hover:text-red-500 transition-colors"
                                    onClick={async () => {
                                      const rappels: LeadReminder[] = (selectedLead.rappels || []).filter(rem => rem.id !== r.id)
                                      await fetch(`/api/leads/${selectedLead.id}`, {
                                        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ rappels }),
                                      })
                                      setSelectedLead({ ...selectedLead, rappels })
                                      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, rappels } : l))
                                    }}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── COMMUNICATION TAB ─────── */}
                  {ficheTab === 'com' && (
                    <div className="space-y-4">
                      <div className="text-center py-6">
                        <Send className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                        <p className="text-sm font-medium text-slate-500">Communications envoyées</p>
                        <p className="text-xs text-slate-400 mb-4">Les messages WhatsApp, emails et SMS apparaîtront ici</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" className="gap-2 h-auto py-3 flex-col" onClick={() => window.open(`https://wa.me/${selectedLead.telephone.replace(/\D/g, '')}`)}>
                          <MessageCircle className="w-5 h-5 text-green-600" />
                          <span className="text-xs">WhatsApp</span>
                        </Button>
                        <Button variant="outline" className="gap-2 h-auto py-3 flex-col" onClick={() => window.open(`mailto:${selectedLead.email}`)}>
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span className="text-xs">Email</span>
                        </Button>
                        <Button variant="outline" className="gap-2 h-auto py-3 flex-col" onClick={() => window.open(`tel:${selectedLead.telephone}`)}>
                          <Phone className="w-5 h-5 text-slate-600" />
                          <span className="text-xs">Appeler</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── DEVIS & FACTURES TAB ──── */}
                  {ficheTab === 'docs' && (
                    <div className="space-y-4">
                      <div className="text-center py-6">
                        <CreditCard className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                        <p className="text-sm font-medium text-slate-500">Devis & Factures</p>
                        <p className="text-xs text-slate-400 mb-4">Créez un devis ou une facture pour ce lead</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center group"
                          onClick={() => {
                            const montant = prompt('Montant du devis (€) :')
                            if (!montant) return
                            const newAction: LeadAction = { id: `h-${Date.now()}`, type: 'note', label: `Devis envoyé : ${montant}€`, date: new Date().toISOString().split('T')[0], agentId: 'agent-1' }
                            const hist: LeadAction[] = [...(selectedLead.historique || []), newAction]
                            fetch(`/api/leads/${selectedLead.id}`, {
                              method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ historique: hist, status: 'proposition_envoyee' }),
                            })
                            setSelectedLead({ ...selectedLead, historique: hist, status: 'proposition_envoyee' as LeadStatus })
                            setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, historique: hist, status: 'proposition_envoyee' as LeadStatus } : l))
                          }}>
                          <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 group-hover:text-blue-500 transition-colors" />
                          <p className="text-sm font-semibold text-slate-700">Créer un devis</p>
                          <p className="text-[10px] text-slate-400">Proposition commerciale</p>
                        </button>
                        <button className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all text-center group"
                          onClick={() => {
                            const montant = prompt('Montant de la facture (€) :')
                            if (!montant) return
                            const newAction: LeadAction = { id: `h-${Date.now()}`, type: 'note', label: `Facture créée : ${montant}€`, date: new Date().toISOString().split('T')[0], agentId: 'agent-1' }
                            const hist: LeadAction[] = [...(selectedLead.historique || []), newAction]
                            fetch(`/api/leads/${selectedLead.id}`, {
                              method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ historique: hist }),
                            })
                            setSelectedLead({ ...selectedLead, historique: hist })
                            setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, historique: hist } : l))
                          }}>
                          <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300 group-hover:text-green-500 transition-colors" />
                          <p className="text-sm font-semibold text-slate-700">Créer une facture</p>
                          <p className="text-[10px] text-slate-400">Facturation client</p>
                        </button>
                      </div>

                      {/* Show docs from historique */}
                      {selectedLead.historique?.filter((a: { label: string }) => a.label.includes('Devis') || a.label.includes('Facture')).length > 0 && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Documents existants</p>
                          <div className="space-y-2">
                            {selectedLead.historique.filter((a: { label: string }) => a.label.includes('Devis') || a.label.includes('Facture')).map((a: { id: string; label: string; date: string }) => (
                              <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                {a.label.includes('Devis') ? <FileText className="w-4 h-4 text-blue-500" /> : <CreditCard className="w-4 h-4 text-green-500" />}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-700">{a.label}</p>
                                  <p className="text-[10px] text-slate-400">{a.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )
          })()}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Secteur</label>
                <Select value={form.secteur} onValueChange={v => setForm(f => ({ ...f, secteur: v ?? f.secteur }))}>
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
