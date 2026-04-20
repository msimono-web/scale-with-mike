'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Zap, Eye, FileText, Loader2, Plus, TrendingUp, Users, MousePointerClick,
  BarChart3, Sparkles, Copy, Trash2, Edit3, ChevronDown, ChevronUp,
  Target, Brain, RefreshCw, ArrowUpRight,
} from 'lucide-react'

/* ── Types ─────────────────────────────────────── */
interface ArticleRow {
  id: string
  titre: string
  slug: string
  cluster: string
  secteur: string
  status: string
  meta_description: string
  extrait: string
  contenu: string
  mots: number
  score_global: number
  score_seo: number
  score_unicite: number
  score_specificite: number
  score_voix: number
  score_actionabilite: number
  vues: number
  clics_cta: number
  leads_generes: number
  taux_conversion: number
  temps_lecture_moy: number
  taux_rebond: number
  keywords: string[]
  generated_from: string | null
  generation_prompt: string | null
  created_at: string
  updated_at: string
}

/* ── Constants ─────────────────────────────────── */
const CLUSTERS = [
  'Prospection téléphonique',
  'Externalisation commerciale',
  'Génération de leads',
  'ROI & Performance',
  'Secteurs d\'activité',
  'Comparatifs & Alternatives',
  'Guides pratiques',
]

const SECTEURS = [
  'Général', 'BTP', 'Immobilier', 'Énergie & Isolation', 'Formation',
  'Services aux entreprises', 'E-commerce', 'Santé', 'Finance', 'Tech/SaaS',
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  brouillon: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700' },
  review: { label: 'En review', color: 'bg-amber-100 text-amber-700' },
  publie: { label: 'Publié', color: 'bg-green-100 text-green-700' },
  desactive: { label: 'Désactivé', color: 'bg-red-100 text-red-700' },
}

/* ── Suggested article ideas per cluster ───────── */
const ARTICLE_IDEAS: Record<string, string[]> = {
  'Prospection téléphonique': [
    'Comment réussir sa prospection téléphonique en {secteur} en 2026',
    '10 scripts d\'appel qui convertissent en {secteur}',
    'Prospection téléphonique vs emailing : quel canal choisir en {secteur} ?',
    'Les erreurs fatales en prospection téléphonique {secteur}',
  ],
  'Externalisation commerciale': [
    'Pourquoi externaliser sa prospection en {secteur} est 3x plus rentable',
    'Externalisation commerciale {secteur} : guide complet 2026',
    'Call center externalisé vs SDR interne : le comparatif {secteur}',
    'Comment choisir son prestataire de téléprospection {secteur}',
  ],
  'Génération de leads': [
    'Comment générer 5 RDV qualifiés par jour en {secteur}',
    'Les meilleures sources de leads {secteur} en 2026',
    'Lead generation {secteur} : les stratégies qui marchent vraiment',
    'Fichier de prospection {secteur} : où le trouver et comment l\'utiliser',
  ],
  'ROI & Performance': [
    'Combien coûte un rendez-vous qualifié en {secteur} ?',
    'ROI de la prospection externalisée : chiffres réels {secteur}',
    'Calculer le coût d\'acquisition client en {secteur}',
    'Comment mesurer la performance de votre prospection {secteur}',
  ],
  'Secteurs d\'activité': [
    'Prospection {secteur} : spécificités et bonnes pratiques',
    'Trouver des clients en {secteur} grâce à la téléprospection',
    'Étude de cas : +200% de RDV en {secteur} avec l\'externalisation',
  ],
  'Comparatifs & Alternatives': [
    'Top 5 des solutions de prospection externalisée en 2026',
    'Alternatives à l\'embauche d\'un commercial en {secteur}',
    'Comparatif call center France vs Madagascar : qualité, prix, résultats',
  ],
  'Guides pratiques': [
    'Guide : externaliser sa prospection étape par étape',
    'Comment briefer un call center pour maximiser les RDV',
    'Créer un script de prospection {secteur} efficace en 30 minutes',
  ],
}

/* ── Page ──────────────────────────────────────── */
export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [clusterFilter, setClusterFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'leads' | 'vues'>('date')

  // Modals
  const [detailArticle, setDetailArticle] = useState<ArticleRow | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showSmartGen, setShowSmartGen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editContent, setEditContent] = useState('')

  // Create form
  const [newTitle, setNewTitle] = useState('')
  const [newCluster, setNewCluster] = useState(CLUSTERS[0])
  const [newSecteur, setNewSecteur] = useState('Général')
  const [newContent, setNewContent] = useState('')
  const [newMeta, setNewMeta] = useState('')
  const [newKeywords, setNewKeywords] = useState('')
  const [creating, setCreating] = useState(false)

  // Fetch articles
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = () => {
    fetch('/api/articles')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setArticles(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  // ── Stats ──────────────────────────────────────
  const totalArticles = articles.length
  const publies = articles.filter(a => a.status === 'publie').length
  const totalVues = articles.reduce((s, a) => s + a.vues, 0)
  const totalLeads = articles.reduce((s, a) => s + a.leads_generes, 0)
  const totalClics = articles.reduce((s, a) => s + a.clics_cta, 0)
  const avgConversion = totalVues > 0 ? ((totalLeads / totalVues) * 100).toFixed(2) : '0'
  const avgScore = totalArticles > 0 ? (articles.reduce((s, a) => s + a.score_global, 0) / totalArticles).toFixed(1) : '0'

  // Top performers (for smart gen)
  const topByLeads = [...articles].filter(a => a.status === 'publie').sort((a, b) => b.leads_generes - a.leads_generes).slice(0, 3)
  const topByVues = [...articles].filter(a => a.status === 'publie').sort((a, b) => b.vues - a.vues).slice(0, 3)
  const topClusters = [...new Set(topByLeads.map(a => a.cluster))]
  const topSecteurs = [...new Set(topByLeads.map(a => a.secteur))]

  // Filter & sort
  const filtered = articles
    .filter(a => statusFilter === 'all' || a.status === statusFilter)
    .filter(a => clusterFilter === 'all' || a.cluster === clusterFilter)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score_global - a.score_global
      if (sortBy === 'leads') return b.leads_generes - a.leads_generes
      if (sortBy === 'vues') return b.vues - a.vues
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  // ── Create article ─────────────────────────────
  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      const slug = newTitle.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: newTitle,
          slug,
          cluster: newCluster,
          secteur: newSecteur,
          contenu: newContent,
          meta_description: newMeta,
          extrait: newContent.slice(0, 200),
          keywords: newKeywords.split(',').map(k => k.trim()).filter(Boolean),
          score_global: 5,
          score_seo: 5,
          score_unicite: 5,
          score_specificite: 5,
          score_voix: 5,
          score_actionabilite: 5,
        }),
      })
      fetchArticles()
      setShowCreate(false)
      resetCreateForm()
    } catch {}
    finally { setCreating(false) }
  }

  const resetCreateForm = () => {
    setNewTitle('')
    setNewCluster(CLUSTERS[0])
    setNewSecteur('Général')
    setNewContent('')
    setNewMeta('')
    setNewKeywords('')
  }

  // ── Update article ─────────────────────────────
  const updateArticle = async (id: string, patch: Partial<ArticleRow>) => {
    await fetch(`/api/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    fetchArticles()
  }

  // ── Delete article ─────────────────────────────
  const deleteArticle = async (id: string) => {
    await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    setDetailArticle(null)
    fetchArticles()
  }

  // ── Smart generate suggestions ─────────────────
  const getSmartSuggestions = () => {
    const suggestions: { titre: string; cluster: string; secteur: string; reason: string }[] = []

    // Based on top performing clusters/sectors
    if (topByLeads.length > 0) {
      const best = topByLeads[0]
      const ideas = ARTICLE_IDEAS[best.cluster] || ARTICLE_IDEAS['Prospection téléphonique']
      ideas.forEach(idea => {
        suggestions.push({
          titre: idea.replace('{secteur}', best.secteur === 'Général' ? '' : best.secteur).replace(/\s+/g, ' ').trim(),
          cluster: best.cluster,
          secteur: best.secteur,
          reason: `Basé sur "${best.titre}" (${best.leads_generes} leads, ${best.vues} vues)`,
        })
      })
    }

    // Fill with suggestions from all clusters if not enough
    if (suggestions.length < 5) {
      CLUSTERS.forEach(cluster => {
        const ideas = ARTICLE_IDEAS[cluster] || []
        const secteur = topSecteurs[0] || 'BTP'
        ideas.slice(0, 1).forEach(idea => {
          if (suggestions.length < 10) {
            suggestions.push({
              titre: idea.replace('{secteur}', secteur),
              cluster,
              secteur,
              reason: 'Suggestion basée sur votre activité',
            })
          }
        })
      })
    }

    return suggestions
  }

  const quickCreate = async (titre: string, cluster: string, secteur: string) => {
    const slug = titre.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titre,
        slug,
        cluster,
        secteur,
        status: 'brouillon',
        score_global: 0,
      }),
    })
    fetchArticles()
  }

  const getScoreColor = (score: number) => {
    if (score < 3) return 'text-red-600'
    if (score < 5) return 'text-orange-500'
    if (score < 7) return 'text-amber-500'
    if (score < 9) return 'text-green-500'
    return 'text-emerald-600'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
    </div>
  )

  return (
    <div className="space-y-6">
      {/* ── KPIs ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { icon: <FileText className="w-4 h-4" />, label: 'Articles', value: totalArticles, sub: `${publies} publiés` },
          { icon: <Eye className="w-4 h-4" />, label: 'Vues totales', value: totalVues.toLocaleString(), sub: 'tous articles' },
          { icon: <Users className="w-4 h-4" />, label: 'Leads générés', value: totalLeads, sub: 'via articles' },
          { icon: <MousePointerClick className="w-4 h-4" />, label: 'Clics CTA', value: totalClics, sub: 'boutons cliqués' },
          { icon: <TrendingUp className="w-4 h-4" />, label: 'Conversion', value: `${avgConversion}%`, sub: 'vues → leads' },
          { icon: <BarChart3 className="w-4 h-4" />, label: 'Score moyen', value: `${avgScore}/10`, sub: 'qualité SEO' },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2 text-slate-400 mb-1">{kpi.icon}<span className="text-[10px] font-bold uppercase tracking-wider">{kpi.label}</span></div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-[10px] text-slate-400">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Actions ────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white">
            <option value="all">Tous les statuts</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={clusterFilter} onChange={e => setClusterFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white">
            <option value="all">Tous les clusters</option>
            {CLUSTERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white">
            <option value="date">Plus récents</option>
            <option value="score">Meilleur score</option>
            <option value="leads">Plus de leads</option>
            <option value="vues">Plus de vues</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowSmartGen(true)} className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            <Brain className="w-4 h-4" /> Smart Generate
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4" /> Nouvel article
          </Button>
        </div>
      </div>

      {/* ── Top Performers ─────────────────────────── */}
      {topByLeads.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-emerald-700">
              <Sparkles className="w-4 h-4" /> Articles les plus performants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-3">
              {topByLeads.map((a, i) => (
                <button key={a.id} onClick={() => setDetailArticle(a)}
                  className="text-left p-4 bg-white rounded-xl border border-emerald-200 hover:border-emerald-400 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-black text-emerald-600">#{i + 1}</span>
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{a.cluster}</Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2">{a.titre}</p>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>{a.leads_generes} leads</span>
                    <span>{a.vues} vues</span>
                    <span>{a.taux_conversion}% conv.</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Articles Table ─────────────────────────── */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <FileText className="w-12 h-12 text-slate-200" />
              <p className="font-semibold">Aucun article</p>
              <p className="text-sm">Créez votre premier article ou utilisez Smart Generate</p>
              <Button onClick={() => setShowSmartGen(true)} className="gap-2 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Brain className="w-4 h-4" /> Smart Generate
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold">TITRE</TableHead>
                    <TableHead className="text-xs font-semibold">CLUSTER</TableHead>
                    <TableHead className="text-xs font-semibold">SECTEUR</TableHead>
                    <TableHead className="text-xs font-semibold">STATUT</TableHead>
                    <TableHead className="text-xs font-semibold">SCORE</TableHead>
                    <TableHead className="text-xs font-semibold">VUES</TableHead>
                    <TableHead className="text-xs font-semibold">LEADS</TableHead>
                    <TableHead className="text-xs font-semibold">CONV.</TableHead>
                    <TableHead className="text-xs font-semibold">MOTS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(article => (
                    <TableRow key={article.id} onClick={() => setDetailArticle(article)}
                      className="cursor-pointer hover:bg-slate-50">
                      <TableCell className="text-sm font-medium max-w-xs">
                        <p className="truncate">{article.titre}</p>
                        {article.generated_from && (
                          <span className="text-[10px] text-purple-500 flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3" /> Auto-généré
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">{article.cluster}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{article.secteur}</TableCell>
                      <TableCell>
                        <Badge className={STATUS_CONFIG[article.status]?.color || 'bg-slate-100'}>
                          {STATUS_CONFIG[article.status]?.label || article.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold text-sm ${getScoreColor(article.score_global)}`}>
                          {article.score_global.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{article.vues.toLocaleString()}</TableCell>
                      <TableCell className="text-sm font-semibold text-emerald-600">{article.leads_generes}</TableCell>
                      <TableCell className="text-sm">{article.taux_conversion}%</TableCell>
                      <TableCell className="text-sm text-slate-400">{article.mots.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── CREATE MODAL ───────────────────────────── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Nouvel article SEO</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ex: Comment générer 5 RDV par jour en BTP" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cluster</Label>
                <select value={newCluster} onChange={e => setNewCluster(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white mt-1">
                  {CLUSTERS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label>Secteur cible</Label>
                <select value={newSecteur} onChange={e => setNewSecteur(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white mt-1">
                  {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Meta description</Label>
              <Input value={newMeta} onChange={e => setNewMeta(e.target.value)} placeholder="Description SEO (160 chars max)" className="mt-1" />
              <p className="text-[10px] text-slate-400 mt-1">{newMeta.length}/160 caractères</p>
            </div>
            <div>
              <Label>Mots-clés (séparés par des virgules)</Label>
              <Input value={newKeywords} onChange={e => setNewKeywords(e.target.value)} placeholder="prospection BTP, leads qualifiés, call center" className="mt-1" />
            </div>
            <div>
              <Label>Contenu</Label>
              <Textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows={10} placeholder="Rédigez ou collez votre article ici..." className="mt-1 font-mono text-sm" />
              <p className="text-[10px] text-slate-400 mt-1">{newContent.split(/\s+/).filter(Boolean).length} mots</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleCreate} disabled={creating} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {creating ? 'Création...' : 'Créer l\'article'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── SMART GENERATE MODAL ───────────────────── */}
      <Dialog open={showSmartGen} onOpenChange={setShowSmartGen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" /> Smart Generate
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {topByLeads.length > 0 ? (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">Apprentissage des données</p>
                <p className="text-sm text-purple-600">
                  Vos meilleurs résultats viennent du cluster <strong>{topClusters[0]}</strong>
                  {topSecteurs[0] && topSecteurs[0] !== 'Général' && <> dans le secteur <strong>{topSecteurs[0]}</strong></>}.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Suggestions de départ</p>
                <p className="text-sm text-blue-600">
                  Ces idées d&apos;articles ciblent des entreprises qui cherchent de la prospection externalisée.
                  Les suggestions s&apos;affineront avec vos données de performance.
                </p>
              </div>
            )}

            <div className="space-y-2">
              {getSmartSuggestions().map((suggestion, i) => (
                <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-purple-300 transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{suggestion.titre}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{suggestion.cluster}</Badge>
                      <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700">{suggestion.secteur}</Badge>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => {
                    quickCreate(suggestion.titre, suggestion.cluster, suggestion.secteur)
                    setShowSmartGen(false)
                  }} className="bg-purple-600 hover:bg-purple-700 text-white gap-1 flex-shrink-0">
                    <Plus className="w-3 h-3" /> Créer
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs text-slate-400 text-center">
                Plus vous publiez, plus les suggestions deviennent pertinentes.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── DETAIL MODAL ───────────────────────────── */}
      <Dialog open={!!detailArticle} onOpenChange={() => { setDetailArticle(null); setEditMode(false) }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {detailArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8">{detailArticle.titre}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                {/* Stats bar */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { label: 'Vues', value: detailArticle.vues },
                    { label: 'Leads', value: detailArticle.leads_generes },
                    { label: 'Clics CTA', value: detailArticle.clics_cta },
                    { label: 'Conversion', value: `${detailArticle.taux_conversion}%` },
                    { label: 'Temps lecture', value: `${detailArticle.temps_lecture_moy}m` },
                    { label: 'Rebond', value: `${detailArticle.taux_rebond}%` },
                  ].map(s => (
                    <div key={s.label} className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">{s.label}</p>
                      <p className="text-sm font-bold text-slate-900">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cluster</p>
                    <Badge variant="secondary" className="mt-1">{detailArticle.cluster}</Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Secteur</p>
                    <Badge variant="secondary" className="mt-1 bg-amber-50 text-amber-700">{detailArticle.secteur}</Badge>
                  </div>
                </div>

                {detailArticle.meta_description && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Meta description</p>
                    <p className="text-sm text-slate-600 mt-1">{detailArticle.meta_description}</p>
                  </div>
                )}

                {/* Scores */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Scores qualité</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { label: 'Global', value: detailArticle.score_global },
                      { label: 'SEO', value: detailArticle.score_seo },
                      { label: 'Unicité', value: detailArticle.score_unicite },
                      { label: 'Spécificité', value: detailArticle.score_specificite },
                      { label: 'Voix', value: detailArticle.score_voix },
                      { label: 'Action', value: detailArticle.score_actionabilite },
                    ].map(sc => (
                      <div key={sc.label} className="text-center p-2 bg-slate-50 rounded-lg">
                        <p className="text-[10px] text-slate-400">{sc.label}</p>
                        <p className={`text-lg font-black ${getScoreColor(sc.value)}`}>{sc.value.toFixed(1)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                {detailArticle.keywords && detailArticle.keywords.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Mots-clés</p>
                    <div className="flex flex-wrap gap-1.5">
                      {detailArticle.keywords.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                {detailArticle.contenu && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Contenu ({detailArticle.mots} mots)</p>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setEditMode(!editMode)
                        setEditContent(detailArticle.contenu)
                      }} className="gap-1 h-7 text-xs">
                        <Edit3 className="w-3 h-3" /> {editMode ? 'Annuler' : 'Modifier'}
                      </Button>
                    </div>
                    {editMode ? (
                      <div className="space-y-2">
                        <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={12} className="font-mono text-sm" />
                        <Button onClick={async () => {
                          await updateArticle(detailArticle.id, { contenu: editContent } as Partial<ArticleRow>)
                          setEditMode(false)
                          setDetailArticle({ ...detailArticle, contenu: editContent, mots: editContent.split(/\s+/).filter(Boolean).length })
                        }} className="bg-blue-600 text-white gap-2" size="sm">
                          <RefreshCw className="w-3 h-3" /> Sauvegarder
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl max-h-64 overflow-y-auto">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{detailArticle.contenu}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                  {detailArticle.status !== 'publie' && (
                    <Button onClick={() => { updateArticle(detailArticle.id, { status: 'publie' }); setDetailArticle(null) }}
                      className="bg-green-600 hover:bg-green-700 text-white gap-2">
                      <ArrowUpRight className="w-4 h-4" /> Publier
                    </Button>
                  )}
                  {detailArticle.status === 'publie' && (
                    <Button onClick={() => { updateArticle(detailArticle.id, { status: 'brouillon' }); setDetailArticle(null) }}
                      variant="secondary" className="gap-2">
                      Dépublier
                    </Button>
                  )}
                  <Button onClick={() => { updateArticle(detailArticle.id, { status: 'review' }); setDetailArticle(null) }}
                    variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" /> Mettre en review
                  </Button>
                  <Button onClick={() => deleteArticle(detailArticle.id)}
                    variant="destructive" className="gap-2 ml-auto">
                    <Trash2 className="w-4 h-4" /> Supprimer
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
