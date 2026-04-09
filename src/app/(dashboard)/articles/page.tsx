'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StatsCard from '@/components/shared/StatsCard'
import { articles } from '@/lib/data'
import type { Article, ArticleStatus } from '@/lib/types'
import { Zap, Eye, Share2 } from 'lucide-react'

const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  brouillon: 'Brouillon',
  review: 'En review',
  publie: 'Publié',
  desactive: 'Désactivé',
}

const ARTICLE_STATUS_COLORS: Record<ArticleStatus, string> = {
  brouillon: 'bg-slate-100 text-slate-800',
  review: 'bg-yellow-100 text-yellow-800',
  publie: 'bg-green-100 text-green-800',
  desactive: 'bg-red-100 text-red-800',
}

const SCORE_COLORS = ['bg-red-100 text-red-800', 'bg-orange-100 text-orange-800', 'bg-yellow-100 text-yellow-800', 'bg-green-100 text-green-800', 'bg-emerald-100 text-emerald-800']

export default function ArticlesPage() {
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredArticles = articles.filter(
    (a) => statusFilter === 'all' || a.status === statusFilter
  )

  const stats = {
    total: articles.length,
    publies: articles.filter((a) => a.status === 'publie').length,
    review: articles.filter((a) => a.status === 'review').length,
    brouillons: articles.filter((a) => a.status === 'brouillon').length,
  }

  const getScoreColor = (score: number) => {
    if (score < 2) return SCORE_COLORS[0]
    if (score < 4) return SCORE_COLORS[1]
    if (score < 6) return SCORE_COLORS[2]
    if (score < 8) return SCORE_COLORS[3]
    return SCORE_COLORS[4]
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="TOTAL ARTICLES" value={stats.total} />
        <StatsCard title="PUBLIÉS" value={stats.publies} />
        <StatsCard title="EN REVIEW" value={stats.review} />
        <StatsCard title="BROUILLONS" value={stats.brouillons} />
      </div>

      {/* Header avec bouton */}
      <div className="flex items-center justify-between">
        <div className="max-w-xs">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Filtrer par statut</label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ArticleStatus | 'all')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="brouillon">Brouillon</SelectItem>
              <SelectItem value="review">En review</SelectItem>
              <SelectItem value="publie">Publié</SelectItem>
              <SelectItem value="desactive">Désactivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white">
          <Zap className="w-4 h-4" />
          GENERATE BATCH
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="articles" className="w-full">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="recherches">Recherches</TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-xs font-semibold">TITRE</TableHead>
                      <TableHead className="text-xs font-semibold">CLUSTER</TableHead>
                      <TableHead className="text-xs font-semibold">STATUT</TableHead>
                      <TableHead className="text-xs font-semibold">SCORE</TableHead>
                      <TableHead className="text-xs font-semibold">MOTS</TableHead>
                      <TableHead className="text-xs font-semibold">DATE</TableHead>
                      <TableHead className="text-xs font-semibold">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow
                        key={article.id}
                        onClick={() => {
                          setSelectedArticle(article)
                          setIsDetailOpen(true)
                        }}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <TableCell className="text-sm font-medium max-w-xs truncate">
                          {article.titre}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{article.cluster}</TableCell>
                        <TableCell>
                          <Badge className={ARTICLE_STATUS_COLORS[article.status]}>
                            {ARTICLE_STATUS_LABELS[article.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getScoreColor(article.scoreGlobal)}>
                            {article.scoreGlobal.toFixed(1)}/10
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{article.mots.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-slate-600">{article.date}</TableCell>
                        <TableCell className="flex gap-1">
                          <Button size="sm" variant="ghost" className="gap-1 h-8">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1 h-8">
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recherches">
          <Card>
            <CardContent className="text-center py-12 text-slate-500">
              Onglet Recherches à configurer
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedArticle.titre}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500">META DESCRIPTION</label>
                    <p className="text-sm mt-1">{selectedArticle.metaDescription}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500">EXTRAIT</label>
                    <p className="text-sm mt-1">{selectedArticle.extrait}</p>
                  </div>
                </div>

                {/* Scores */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">SCORES</label>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Unicité</p>
                      <Badge className={getScoreColor(selectedArticle.scores.unicite)}>
                        {selectedArticle.scores.unicite.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Spécificité</p>
                      <Badge className={getScoreColor(selectedArticle.scores.specificite)}>
                        {selectedArticle.scores.specificite.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Voix</p>
                      <Badge className={getScoreColor(selectedArticle.scores.voix)}>
                        {selectedArticle.scores.voix.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">SEO</p>
                      <Badge className={getScoreColor(selectedArticle.scores.seo)}>
                        {selectedArticle.scores.seo.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Actionabilité</p>
                      <Badge className={getScoreColor(selectedArticle.scores.actionabilite)}>
                        {selectedArticle.scores.actionabilite.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div>
                  <label className="text-xs font-semibold text-slate-500">CONTENU</label>
                  <div className="mt-2 p-4 bg-slate-50 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedArticle.contenu}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button className="flex-1" variant={selectedArticle.status === 'publie' ? 'secondary' : 'default'}>
                    {selectedArticle.status === 'publie' ? 'DÉPUBLIER' : 'PUBLIER'}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    REVIEW
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    DÉSACTIVER
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
