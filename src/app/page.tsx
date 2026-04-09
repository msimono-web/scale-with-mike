import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown, BarChart3, Users, FileText, MessageSquare, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Crown className="w-6 h-6 text-yellow-500" />
            <span>ScaleWithMike</span>
          </div>
          <Link href="/dashboard">
            <Button className="gap-2">
              Accéder au CRM
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-slate-900">
          Générez des rendez-vous<br />
          <span className="text-blue-600">qualifiés</span> pour votre business
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Plateforme CRM Call Center complète pour piloter votre acquisition commerciale.
          Pipeline Kanban, scoring IA, leaderboard temps réel et analytics détaillées.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Démarrer le CRM
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Voir la démo
          </Button>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-50 py-20 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Tarification Simple</h2>

          <div className="grid grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-slate-200">
              <h3 className="text-lg font-bold mb-2">Starter</h3>
              <p className="text-slate-600 text-sm mb-4">Pour les équipes nouvelles</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">799€</span>
                <span className="text-slate-600">/agent/mois</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li>✓ Pipeline Kanban illimité</li>
                <li>✓ Scoring IA de base</li>
                <li>✓ 1 utilisateur admin</li>
                <li>✓ Email & WhatsApp templates</li>
              </ul>
              <Button variant="outline" className="w-full">
                Choisir ce plan
              </Button>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 text-white rounded-lg shadow-lg p-8 border-2 border-blue-600 relative">
              <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-blue-900 text-center py-2 text-sm font-bold rounded-t-lg">
                POPULAIRE
              </div>
              <h3 className="text-lg font-bold mb-2 mt-4">Pro</h3>
              <p className="text-blue-100 text-sm mb-4">Pour les équipes en croissance</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">899€</span>
                <span className="text-blue-100">/agent/mois</span>
              </div>
              <ul className="space-y-3 text-sm text-blue-100 mb-6">
                <li>✓ Tout du plan Starter</li>
                <li>✓ Analytics en temps réel</li>
                <li>✓ Leaderboard agents</li>
                <li>✓ Intégration Stripe</li>
                <li>✓ Calendrier RDV</li>
              </ul>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Choisir ce plan
              </Button>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-slate-200">
              <h3 className="text-lg font-bold mb-2">Enterprise</h3>
              <p className="text-slate-600 text-sm mb-4">Pour les grands comptes</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">1 299€</span>
                <span className="text-slate-600">/agent/mois</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li>✓ Tout du plan Pro</li>
                <li>✓ Scoring LLM avancé</li>
                <li>✓ Génération articles SEO</li>
                <li>✓ API webhook custom</li>
                <li>✓ Support prioritaire</li>
              </ul>
              <Button variant="outline" className="w-full">
                Nous contacter
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-600 mt-8">
            Tarifs dégressifs à partir de 5 agents. Essai gratuit 14 jours.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités Principales</h2>

        <div className="grid grid-cols-2 gap-12">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold mb-2">CRM Complet</h3>
              <p className="text-slate-600 text-sm">
                Pipeline Kanban, gestion de leads, historique d'actions, notes détaillées.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Leaderboard Agents</h3>
              <p className="text-slate-600 text-sm">
                Classement temps réel, win rates, CA généré par agent et par période.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Génération Articles SEO</h3>
              <p className="text-slate-600 text-sm">
                IA-powered, scoring unicité/spécificité, clustering par sujet, publish ready.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold mb-2">Communication Omnicanale</h3>
              <p className="text-slate-600 text-sm">
                Templates WhatsApp, Email, SMS avec variables dynamiques et historique complet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre acquisition ?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Commencez avec votre équipe aujourd'hui. Configuration en 15 minutes.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Accéder au CRM
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© 2025 ScaleWithMike. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
