'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import StatsCard from '@/components/shared/StatsCard'
import type { Lead, InvoiceStatus } from '@/lib/types'
import { CreditCard, Loader2 } from 'lucide-react'

interface Invoice {
  id: string
  leadId: string
  plan: string
  montant: number
  status: InvoiceStatus
  dateEmission: string
  contrat?: string
}

const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  paye: 'Payé', en_attente: 'En attente', echoue: 'Échoué', non_envoye: 'Non envoyé',
}

const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  paye: 'bg-green-100 text-green-800',
  en_attente: 'bg-slate-100 text-slate-800',
  echoue: 'bg-red-100 text-red-800',
  non_envoye: 'bg-orange-100 text-orange-800',
}

export default function InvoicesPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLeads(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Construire les factures depuis les leads signés
  const invoices: Invoice[] = leads
    .filter(l => l.status === 'signe')
    .map(l => ({
      id: l.id,
      leadId: l.id,
      plan: 'Accompagnement',
      montant: l.caPotentiel,
      status: 'en_attente' as InvoiceStatus,
      dateEmission: l.dateEntree,
    }))

  const filtered = invoices.filter(i => statusFilter === 'all' || i.status === statusFilter)

  const stats = {
    revenue: invoices.filter(i => i.status === 'paye').reduce((s, i) => s + i.montant, 0),
    payes: invoices.filter(i => i.status === 'paye').length,
    enAttente: invoices.filter(i => i.status === 'en_attente').length,
    echoues: invoices.filter(i => i.status === 'echoue').length,
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Paiements & Contrats</h1>
        <p className="text-sm text-slate-600">Stripe Payment Links · Suivi des paiements</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="REVENUS" value={`${(stats.revenue / 1000).toFixed(1)}k€`} />
        <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-600">PAYÉS</p>
          <p className="text-2xl font-bold text-green-600">{stats.payes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-600">EN ATTENTE</p>
          <p className="text-2xl font-bold text-slate-600">{stats.enAttente}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-600">ÉCHOUÉS</p>
          <p className="text-2xl font-bold text-red-600">{stats.echoues}</p>
        </div>
      </div>

      <div className="max-w-xs">
        <label className="text-sm font-medium text-slate-700 mb-1 block">Filtrer par statut</label>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as InvoiceStatus | 'all')}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="paye">Payé</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="echoue">Échoué</SelectItem>
            <SelectItem value="non_envoye">Non envoyé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <CreditCard className="w-12 h-12 text-slate-200" />
              <p className="font-medium">Aucune facture</p>
              <p className="text-sm">Les factures apparaîtront automatiquement pour les leads signés</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {['LEAD', 'EMAIL', 'STATUT', 'PLAN', 'MONTANT', 'DATE', 'ACTIONS'].map(h => (
                      <TableHead key={h} className="text-xs font-semibold">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(invoice => {
                    const lead = leads.find(l => l.id === invoice.leadId)
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="text-sm font-medium">
                          {lead ? `${lead.prenom} ${lead.nom}` : '—'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{lead?.email}</TableCell>
                        <TableCell>
                          <Badge className={INVOICE_STATUS_COLORS[invoice.status]}>
                            {INVOICE_STATUS_LABELS[invoice.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{invoice.plan}</TableCell>
                        <TableCell className="text-sm font-semibold">{invoice.montant.toLocaleString()}€</TableCell>
                        <TableCell className="text-sm text-slate-600">{invoice.dateEmission}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="gap-1 h-8 text-xs">
                              <CreditCard className="w-3 h-3" />1x
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs">3x</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
