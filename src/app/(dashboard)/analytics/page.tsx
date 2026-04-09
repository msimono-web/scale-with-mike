'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { dailyStats, sourceStats } from '@/lib/data'

type Period = '7j' | '30j' | '90j' | 'all'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30j')

  // Données de santé des emails
  const healthScore = 92
  const emailStats = {
    envoyes: 1240,
    delivres: 1198,
    ouverts: 847,
    cliques: 234,
    bounce: 42,
    plaintes: 5,
  }

  // Funnel de conversion
  const funnelData = [
    { name: 'Leads', value: 500, percentage: 100 },
    { name: 'Candidatures', value: 320, percentage: 64 },
    { name: 'Acceptés', value: 198, percentage: 62 },
    { name: 'Payés', value: 156, percentage: 79 },
  ]

  return (
    <div className="space-y-6">
      {/* Period Filter */}
      <div className="flex gap-2">
        {(['7j', '30j', '90j', 'all'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {p === '7j' ? '7 jours' : p === '30j' ? '30 jours' : p === '90j' ? '90 jours' : 'Tout'}
          </button>
        ))}
      </div>

      <Tabs defaultValue="sante" className="w-full">
        <TabsList>
          <TabsTrigger value="sante">Santé</TabsTrigger>
          <TabsTrigger value="sequences">Séquences</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="sante" className="space-y-6">
          {/* Health Score Gauge */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Score de Santé Email</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-8 border-slate-200"></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-green-500"
                    style={{
                      background: `conic-gradient(#10b981 0deg ${(healthScore / 100) * 360}deg, #e5e7eb ${(healthScore / 100) * 360}deg)`,
                    }}
                  ></div>
                  <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl font-bold text-green-600">{healthScore}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600">Santé générale excellent</p>
              </div>
            </CardContent>
          </Card>

          {/* Email Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-600">ENVOYÉS</span>
                    <span className="text-lg font-bold">{emailStats.envoyes.toLocaleString()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-600">OUVERTS</span>
                    <span className="text-lg font-bold text-blue-600">
                      {((emailStats.ouverts / emailStats.envoyes) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(emailStats.ouverts / emailStats.envoyes) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-600">CLIQUÉS</span>
                    <span className="text-lg font-bold text-green-600">
                      {((emailStats.cliques / emailStats.ouverts) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(emailStats.cliques / emailStats.ouverts) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tendance emails */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tendance Emails (30j)</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Line type="monotone" dataKey="leads" stroke="#3b82f6" name="Leads" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="rdv" stroke="#10b981" name="RDV" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="signes" stroke="#f59e0b" name="Signés" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sequences" className="text-center py-8">
          <p className="text-slate-500">Onglet Séquences à configurer</p>
        </TabsContent>

        <TabsContent value="broadcast" className="text-center py-8">
          <p className="text-slate-500">Onglet Broadcast à configurer</p>
        </TabsContent>

        <TabsContent value="journal" className="text-center py-8">
          <p className="text-slate-500">Onglet Journal à configurer</p>
        </TabsContent>
      </Tabs>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Funnel de Conversion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {funnelData.map((stage, index) => (
            <div key={stage.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{stage.name}</span>
                <span className="text-xs font-semibold text-slate-600">
                  {stage.value} ({stage.percentage}%)
                </span>
              </div>
              <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-end pr-3 transition-all"
                  style={{ width: `${stage.percentage}%` }}
                >
                  <span className="text-xs font-bold text-white">{stage.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attribution par source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Attribution par Source</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-xs font-semibold">SOURCE</TableHead>
                  <TableHead className="text-xs font-semibold">LEADS</TableHead>
                  <TableHead className="text-xs font-semibold">CONTACTÉS</TableHead>
                  <TableHead className="text-xs font-semibold">RDV</TableHead>
                  <TableHead className="text-xs font-semibold">SIGNÉS</TableHead>
                  <TableHead className="text-xs font-semibold">TAUX ACCEPTATION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourceStats.map((stat) => (
                  <TableRow key={stat.source}>
                    <TableCell className="text-sm font-medium">{stat.source}</TableCell>
                    <TableCell className="text-sm">{stat.leads}</TableCell>
                    <TableCell className="text-sm">{stat.contactes}</TableCell>
                    <TableCell className="text-sm">{stat.rdv}</TableCell>
                    <TableCell className="text-sm font-semibold text-green-600">{stat.signes}</TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="secondary">{(stat.tauxAcceptation * 100).toFixed(1)}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
