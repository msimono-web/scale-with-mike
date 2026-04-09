'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { templates, messageHistory, leads } from '@/lib/data'
import type { TemplateType, Template } from '@/lib/types'
import { Plus, Edit2 } from 'lucide-react'

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<TemplateType>('whatsapp')
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const templatesByType = (type: TemplateType) => templates.filter((t) => t.type === type)
  const messageHistoryByType = (type: TemplateType) => messageHistory.filter((m) => m.type === type)

  const tabs: Array<{ value: TemplateType; label: string }> = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TemplateType)} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Dialog open={isNewTemplateOpen} onOpenChange={setIsNewTemplateOpen}>
            <DialogTrigger>
              <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 gap-2">
                <Plus className="w-4 h-4" />
                Nouveau Template
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau template</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Nom</Label>
                  <Input placeholder="Ex: Premier contact" />
                </div>

                {activeTab === 'email' && (
                  <div>
                    <Label>Sujet</Label>
                    <Input placeholder="Sujet de l'email" />
                  </div>
                )}

                <div>
                  <Label>Contenu</Label>
                  <Textarea
                    placeholder={'Contenu du message. Variables disponibles: {prénom}, {advisor}'}
                    rows={6}
                  />
                </div>

                <div className="text-xs text-slate-500">
                  <p className="font-semibold mb-1">Variables disponibles:</p>
                  <p>{'{prénom}, {advisor}, {entreprise}, {secteur}'}</p>
                </div>

                <Button className="w-full">Créer le template</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {/* Templates */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Templates ({templatesByType(tab.value).length})</h3>

              <div className="grid grid-cols-1 gap-4">
                {templatesByType(tab.value).map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-2">{template.nom}</h4>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {template.contenu}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {template.variables.map((v) => (
                              <Badge key={v} variant="secondary" className="text-xs">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => setEditingTemplate(template)}
                          >
                            <Edit2 className="w-3 h-3" />
                            Éditer
                          </Button>
                          <Button size="sm">Utiliser</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Message History */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Historique Messages</h3>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead className="text-xs font-semibold">LEAD</TableHead>
                          <TableHead className="text-xs font-semibold">CONTENU</TableHead>
                          <TableHead className="text-xs font-semibold">DATE</TableHead>
                          <TableHead className="text-xs font-semibold">STATUT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messageHistoryByType(tab.value).map((msg) => {
                          const lead = leads.find((l) => l.id === msg.leadId)
                          return (
                            <TableRow key={msg.id}>
                              <TableCell className="text-sm font-medium">
                                {lead && `${lead.prenom} ${lead.nom}`}
                              </TableCell>
                              <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                                {msg.contenu}
                              </TableCell>
                              <TableCell className="text-sm text-slate-600">{msg.date}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    msg.status === 'repondu'
                                      ? 'default'
                                      : msg.status === 'lu'
                                        ? 'secondary'
                                        : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {msg.status === 'envoye'
                                    ? 'Envoyé'
                                    : msg.status === 'lu'
                                      ? 'Lu'
                                      : 'Répondu'}
                                </Badge>
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
