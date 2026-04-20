'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Edit2, MessageSquare, Mail, Smartphone } from 'lucide-react'

type TemplateType = 'whatsapp' | 'email' | 'sms'

interface Template {
  id: string
  nom: string
  sujet?: string
  contenu: string
  variables: string[]
  type: TemplateType
}

const DEFAULT_VARIABLES = ['{prénom}', '{entreprise}', '{secteur}', '{advisor}']

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<TemplateType>('whatsapp')
  const [templates, setTemplates] = useState<Template[]>([])
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [form, setForm] = useState({ nom: '', sujet: '', contenu: '' })

  const byType = (type: TemplateType) => templates.filter(t => t.type === type)

  const handleSave = () => {
    if (!form.nom || !form.contenu) return
    const vars = DEFAULT_VARIABLES.filter(v => form.contenu.includes(v))
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id
        ? { ...t, nom: form.nom, sujet: form.sujet, contenu: form.contenu, variables: vars }
        : t))
      setEditingTemplate(null)
    } else {
      setTemplates(prev => [...prev, {
        id: Date.now().toString(), type: activeTab,
        nom: form.nom, sujet: form.sujet, contenu: form.contenu, variables: vars,
      }])
    }
    setForm({ nom: '', sujet: '', contenu: '' })
    setIsNewOpen(false)
  }

  const tabs = [
    { value: 'whatsapp' as TemplateType, label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { value: 'email' as TemplateType, label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
    { value: 'sms' as TemplateType, label: 'SMS', icon: <Smartphone className="w-3.5 h-3.5" /> },
  ]

  const TemplateForm = () => (
    <div className="space-y-4">
      <div>
        <Label>Nom du template</Label>
        <Input placeholder="Ex: Premier contact" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
      </div>
      {activeTab === 'email' && (
        <div>
          <Label>Sujet</Label>
          <Input placeholder="Sujet de l'email" value={form.sujet} onChange={e => setForm(f => ({ ...f, sujet: e.target.value }))} />
        </div>
      )}
      <div>
        <Label>Contenu</Label>
        <Textarea
          placeholder="Bonjour {prénom}, je suis {advisor} de ScaleWithMike…"
          rows={6}
          value={form.contenu}
          onChange={e => setForm(f => ({ ...f, contenu: e.target.value }))}
        />
      </div>
      <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
        <p className="font-semibold mb-1">Variables disponibles :</p>
        <div className="flex gap-1 flex-wrap">
          {DEFAULT_VARIABLES.map(v => (
            <button key={v} onClick={() => setForm(f => ({ ...f, contenu: f.contenu + v }))}
              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs hover:bg-slate-100">
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => { setIsNewOpen(false); setEditingTemplate(null); setForm({ nom: '', sujet: '', contenu: '' }) }}>
          Annuler
        </Button>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave} disabled={!form.nom || !form.contenu}>
          {editingTemplate ? 'Enregistrer' : 'Créer le template'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as TemplateType)} className="w-full">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                {tab.icon}{tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <Dialog open={isNewOpen} onOpenChange={v => { setIsNewOpen(v); if (!v) { setEditingTemplate(null); setForm({ nom: '', sujet: '', contenu: '' }) } }}>
            <DialogTrigger>
              <span className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />Nouveau Template
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un template {activeTab}</DialogTitle>
              </DialogHeader>
              <TemplateForm />
            </DialogContent>
          </Dialog>
        </div>

        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {byType(tab.value).length === 0 ? (
              <Card className="p-12 text-center text-slate-400">
                <div className="text-slate-200 mb-4 flex justify-center">
                  {tab.value === 'whatsapp' ? <MessageSquare className="w-12 h-12" /> : tab.value === 'email' ? <Mail className="w-12 h-12" /> : <Smartphone className="w-12 h-12" />}
                </div>
                <p className="text-lg font-semibold text-slate-700 mb-2">Aucun template {tab.label}</p>
                <p className="text-sm mb-4">Créez vos premiers templates de messages pour gagner du temps lors des relances.</p>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsNewOpen(true)}>
                  <Plus className="w-4 h-4" />Créer un template
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {byType(tab.value).map(template => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{template.nom}</h4>
                          {template.sujet && <p className="text-xs text-slate-500 mb-1">Sujet : {template.sujet}</p>}
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2 whitespace-pre-line">{template.contenu}</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {template.variables.map(v => (
                              <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" className="gap-1"
                            onClick={() => { setEditingTemplate(template); setForm({ nom: template.nom, sujet: template.sujet ?? '', contenu: template.contenu }); setIsNewOpen(true) }}>
                            <Edit2 className="w-3 h-3" />Éditer
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Utiliser</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
