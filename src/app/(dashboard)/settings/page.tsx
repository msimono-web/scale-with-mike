'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { templates } from '@/lib/data'
import type { TemplateType } from '@/lib/types'

export default function SettingsPage() {
  const [whatsappMessage, setWhatsappMessage] = useState(
    'Bonjour {prénom}, je suis ton Advisor ScaleWithMike. On se retrouve bientôt pour ton appel de découverte ! 🤝'
  )
  const [scoringPrompt, setScoringPrompt] = useState(
    'Évaluer la qualité du lead basé sur: secteur d\'activité, potentiel de fermeture, fit avec nos services...'
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Configuration du Dashboard</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">Gérer les paramètres et templates</p>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Vertical Tabs */}
      <div className="grid grid-cols-4 gap-6">
        {/* Tab List Vertical */}
        <div className="col-span-1">
          <Tabs defaultValue="whatsapp" orientation="vertical" className="w-full">
            <TabsList className="flex flex-col w-full h-auto bg-transparent border-r border-slate-200">
              <TabsTrigger
                value="whatsapp"
                className="justify-start w-full text-left py-3 px-4 border-0 border-r-2 border-r-transparent data-[state=active]:border-r-blue-600 data-[state=active]:bg-blue-50"
              >
                WhatsApp
              </TabsTrigger>
              <TabsTrigger
                value="scoring"
                className="justify-start w-full text-left py-3 px-4 border-0 border-r-2 border-r-transparent data-[state=active]:border-r-blue-600 data-[state=active]:bg-blue-50"
              >
                Scoring LLM
              </TabsTrigger>
              <TabsTrigger
                value="cohort"
                className="justify-start w-full text-left py-3 px-4 border-0 border-r-2 border-r-transparent data-[state=active]:border-r-blue-600 data-[state=active]:bg-blue-50"
              >
                Cohorte
              </TabsTrigger>
              <TabsTrigger
                value="twitter"
                className="justify-start w-full text-left py-3 px-4 border-0 border-r-2 border-r-transparent data-[state=active]:border-r-blue-600 data-[state=active]:bg-blue-50"
              >
                Twitter
              </TabsTrigger>
              <TabsTrigger
                value="contracts"
                className="justify-start w-full text-left py-3 px-4 border-0 border-r-2 border-r-transparent data-[state=active]:border-r-blue-600 data-[state=active]:bg-blue-50"
              >
                Contrats
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="col-span-3">
              <TabsContent value="whatsapp" className="col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">WhatsApp</CardTitle>
                    <p className="text-xs text-slate-600 mt-2">
                      Message pré-rempli envoyé aux leads. Variables: {'{prénom}, {advisor}'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Message</Label>
                      <Textarea
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scoring" className="col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Scoring LLM</CardTitle>
                    <p className="text-xs text-slate-600 mt-2">
                      Configuration du prompt de scoring intelligence artificielle
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Prompt Scoring</Label>
                      <Textarea
                        value={scoringPrompt}
                        onChange={(e) => setScoringPrompt(e.target.value)}
                        rows={6}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Variables disponibles:</p>
                      <p className="text-xs text-blue-800">
                        {'{entreprise}, {secteur}, {score_source}, {qualite_contact}, {potentiel_ca}'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cohort" className="col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Cohorte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Configuration des cohortes de leads à ajouter</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="twitter" className="col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Twitter / X</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>API Key</Label>
                      <Input type="password" placeholder="Votre API key Twitter" />
                    </div>
                    <div>
                      <Label>API Secret</Label>
                      <Input type="password" placeholder="Votre API secret Twitter" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contracts" className="col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Contrats</CardTitle>
                    <p className="text-xs text-slate-600 mt-2">Templates de contrats disponibles</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {templates
                        .filter((t) => t.type === 'email')
                        .slice(0, 2)
                        .map((template) => (
                          <Card key={template.id} className="bg-slate-50">
                            <CardContent className="p-3">
                              <h4 className="font-semibold text-sm">{template.nom}</h4>
                              <p className="text-xs text-slate-600 mt-1 truncate">
                                {template.contenu}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
