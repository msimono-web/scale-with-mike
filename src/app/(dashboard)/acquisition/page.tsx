'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { landingPages, sourceStats } from '@/lib/data'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

export default function AcquisitionPage() {
  const [activeTab, setActiveTab] = useState('lead-magnet')

  const totalDownloads = landingPages.reduce((sum, lp) => sum + lp.formulaires, 0)
  const totalLeads = landingPages.reduce((sum, lp) => sum + lp.leadsQualifies, 0)

  // Données pour le donut
  const sectorData = [
    { name: 'BTP', value: 28 },
    { name: 'Immobilier', value: 22 },
    { name: 'E-commerce', value: 19 },
    { name: 'Restauration', value: 15 },
    { name: 'Coaching', value: 12 },
    { name: 'Autres', value: 4 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="TOTAL TÉLÉCHARGEMENTS" value={totalDownloads} />
        <StatsCard title="LEADS GÉNÉRÉS" value={totalLeads} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="lead-magnet">Lead Magnet</TabsTrigger>
          <TabsTrigger value="webinar">Webinaire</TabsTrigger>
          <TabsTrigger value="20min">20 Minutes</TabsTrigger>
        </TabsList>

        <TabsContent value="lead-magnet" className="space-y-6">
          {/* Donut chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Distribution par Secteur</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Landing Pages Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Landing Pages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-xs font-semibold">NOM</TableHead>
                      <TableHead className="text-xs font-semibold">URL</TableHead>
                      <TableHead className="text-xs font-semibold">VUES</TableHead>
                      <TableHead className="text-xs font-semibold">FORMULAIRES</TableHead>
                      <TableHead className="text-xs font-semibold">LEADS QUALIFIÉS</TableHead>
                      <TableHead className="text-xs font-semibold">TAUX CONVERSION</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {landingPages.map((lp) => (
                      <TableRow key={lp.id}>
                        <TableCell className="text-sm font-medium">{lp.nom}</TableCell>
                        <TableCell className="text-sm text-slate-600 text-xs">{lp.url}</TableCell>
                        <TableCell className="text-sm">{lp.vues.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{lp.formulaires}</TableCell>
                        <TableCell className="text-sm font-semibold text-green-600">{lp.leadsQualifies}</TableCell>
                        <TableCell className="text-sm">
                          <Badge variant="secondary">{(lp.tauxConversion * 100).toFixed(1)}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webinar" className="text-center py-8">
          <p className="text-slate-500">Onglet Webinaire à configurer</p>
        </TabsContent>

        <TabsContent value="20min" className="text-center py-8">
          <p className="text-slate-500">Onglet 20 Minutes à configurer</p>
        </TabsContent>
      </Tabs>

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
