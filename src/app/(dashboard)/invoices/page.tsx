'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import StatsCard from '@/components/shared/StatsCard'
import { invoices, leads } from '@/lib/data'
import type { InvoiceStatus } from '@/lib/types'
import { CreditCard, Link2 } from 'lucide-react'

const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  paye: 'Payé',
  en_attente: 'En attente',
  echoue: 'Échoué',
  non_envoye: 'Non envoyé',
}

const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  paye: 'bg-green-100 text-green-800',
  en_attente: 'bg-slate-100 text-slate-800',
  echoue: 'bg-red-100 text-red-800',
  non_envoye: 'bg-orange-100 text-orange-800',
}

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')

  const filteredInvoices = invoices.filter(
    (inv) => statusFilter === 'all' || inv.status === statusFilter
  )

  const stats = {
    revenue: invoices
      .filter((i) => i.status === 'paye')
      .reduce((sum, i) => sum + i.montant, 0),
    payes: invoices.filter((i) => i.status === 'paye').length,
    enAttente: invoices.filter((i) => i.status === 'en_attente').length,
    echoues: invoices.filter((i) => i.status === 'echoue').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Paiements & Contrats</h1>
        <p className="text-sm text-slate-600">Stripe Payment Links · Suivi des paiements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
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

      {/* Filter */}
      <div className="max-w-xs">
        <label className="text-sm font-medium text-slate-700 mb-1 block">Filtrer par statut</label>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as InvoiceStatus | 'all')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="paye">Payé</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="echoue">Échoué</SelectItem>
            <SelectItem value="non_envoye">Non envoyé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold">LEAD</TableHead>
                  <TableHead className="text-xs font-semibold">EMAIL</TableHead>
                  <TableHead className="text-xs font-semibold">STATUT PAIEMENT</TableHead>
                  <TableHead className="text-xs font-semibold">PLAN</TableHead>
                  <TableHead className="text-xs font-semibold">CONTRAT</TableHead>
                  <TableHead className="text-xs font-semibold">MONTANT</TableHead>
                  <TableHead className="text-xs font-semibold">DATE ÉMISSION</TableHead>
                  <TableHead className="text-xs font-semibold">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const lead = leads.find((l) => l.id === invoice.leadId)
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="text-sm font-medium">
                        {lead && `${lead.prenom} ${lead.nom}`}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{lead?.email}</TableCell>
                      <TableCell>
                        <Badge className={INVOICE_STATUS_COLORS[invoice.status]}>
                          {INVOICE_STATUS_LABELS[invoice.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{invoice.plan}</TableCell>
                      <TableCell className="text-sm text-slate-600">{invoice.contrat || '-'}</TableCell>
                      <TableCell className="text-sm font-semibold">{invoice.montant.toLocaleString()}€</TableCell>
                      <TableCell className="text-sm text-slate-600">{invoice.dateEmission}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="gap-1 h-8 text-xs">
                            <CreditCard className="w-3 h-3" />
                            1x
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 h-8 text-xs">
                            3x
                          </Button>
                        </div>
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
