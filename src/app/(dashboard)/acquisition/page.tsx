'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, CheckCircle2, Circle, Zap } from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  color: string
  textColor: string
  connected: boolean
  logo: React.ReactNode
  connectUrl?: string
}

// SVG Logos
const MetaLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
    <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4z" fill="#1877F2"/>
    <path d="M26.5 26.5h3.5l.7-4H26.5v-2c0-1.1.5-2 2.2-2H31v-3.4S29.7 15 28 15c-3.3 0-5.5 2-5.5 5.5V22.5h-3V26.5h3V36h4V26.5z" fill="white"/>
  </svg>
)

const InstagramLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <radialGradient id="ig1" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#fd5"/>
      <stop offset=".328" stopColor="#ff543f"/>
      <stop offset=".348" stopColor="#fc5245"/>
      <stop offset=".504" stopColor="#e64771"/>
      <stop offset=".643" stopColor="#d53e91"/>
      <stop offset=".761" stopColor="#cc39a4"/>
      <stop offset=".841" stopColor="#c837ab"/>
    </radialGradient>
    <path fill="url(#ig1)" d="M34.017 41.99l-20 .019c-4.4.004-8.003-3.592-8.008-7.992l-.019-20c-.004-4.4 3.592-8.003 7.992-8.008l20-.019c4.4-.004 8.003 3.592 8.008 7.992l.019 20c.005 4.401-3.592 8.004-7.992 8.008z"/>
    <path fill="#fff" d="M24 31c-3.859 0-7-3.14-7-7s3.141-7 7-7 7 3.14 7 7-3.141 7-7 7zm0-12c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm6.5-3c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zM29 36H19c-3.859 0-7-3.14-7-7V19c0-3.86 3.141-7 7-7h10c3.859 0 7 3.14 7 7v10c0 3.86-3.141 7-7 7zm-10-22c-2.757 0-5 2.243-5 5v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V19c0-2.757-2.243-5-5-5H19z"/>
  </svg>
)

const LinkedInLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <path fill="#0078d4" d="M42 37c0 2.762-2.238 5-5 5H11c-2.761 0-5-2.238-5-5V11c0-2.762 2.239-5 5-5h26c2.762 0 5 2.238 5 5v26z"/>
    <path fill="#fff" d="M30 37v-10c0-1.1-.9-2-2-2s-2 .9-2 2v10h-6V20h6v1.765C27.358 20.685 28.637 20 30 20c3.313 0 6 2.687 6 6v11h-6zM14 18.765C12.343 18.765 11 17.422 11 15.765S12.343 12.765 14 12.765s3 1.343 3 3-1.343 3-3 3zM11 37V20h6v17h-6z"/>
  </svg>
)

const TikTokLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <path fill="#010101" d="M38 4H10C6.686 4 4 6.686 4 10v28c0 3.314 2.686 6 6 6h28c3.314 0 6-2.686 6-6V10c0-3.314-2.686-6-6-6z"/>
    <path fill="#ee1d52" d="M28.5 16.3c1.5 1.7 3.6 2.8 5.8 3v4.1c-2.1-.2-4-.9-5.6-2v9.1c0 4.5-3.7 8.2-8.2 8.2-4.5 0-8.2-3.7-8.2-8.2s3.7-8.2 8.2-8.2c.5 0 .9 0 1.4.1v4.2c-.5-.1-.9-.2-1.4-.2-2.3 0-4.1 1.8-4.1 4.1s1.8 4.1 4.1 4.1c2.3 0 4.1-1.8 4.2-4V12.5h4.1c-.2 1.3.1 2.7.7 3.8z"/>
    <path fill="#69c9d0" d="M27.2 15c1.5 1.7 3.6 2.8 5.8 3v4.1c-2.1-.2-4-.9-5.6-2v9.1c0 4.5-3.7 8.2-8.2 8.2-4.5 0-8.2-3.7-8.2-8.2s3.7-8.2 8.2-8.2c.5 0 .9 0 1.4.1v4.2c-.5-.1-.9-.2-1.4-.2-2.3 0-4.1 1.8-4.1 4.1s1.8 4.1 4.1 4.1c2.3 0 4.1-1.8 4.2-4V11.2h4.1c0 1.4.4 2.7.7 3.8z"/>
  </svg>
)

const GoogleAdsLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <path fill="#4285F4" d="M42 24c0-1.1-.1-2.2-.2-3.3H24v6.3h10.1c-.4 2.3-1.8 4.3-3.9 5.6v4.6h6.3C39.7 34.1 42 29.4 42 24z"/>
    <path fill="#34A853" d="M24 43c5.4 0 9.9-1.8 13.2-4.8l-6.3-4.9c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H6.1v5C9.4 38.8 16.2 43 24 43z"/>
    <path fill="#FBBC05" d="M12.6 26.8c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8v-5H6.1C4.8 16.8 4 20.3 4 24s.8 7.2 2.1 9.8l6.5-5z"/>
    <path fill="#EA4335" d="M24 13.8c3 0 5.7 1 7.8 3l5.8-5.8C34 7.8 29.4 6 24 6 16.2 6 9.4 10.2 6.1 16.8l6.5 5c1.6-4.8 6.1-8 11.4-8z"/>
  </svg>
)

const WhatsAppLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <path fill="#25D366" d="M4.868 43.303l2.694-9.835a18.921 18.921 0 01-2.527-9.505C5.04 13.393 13.997 5 24.918 5c5.307.002 10.29 2.07 14.039 5.821a19.683 19.683 0 015.803 14.041c-.004 10.925-8.961 19.319-19.882 19.319a19.86 19.86 0 01-9.504-2.416L4.868 43.303z"/>
    <path fill="#fff" d="M35.176 12.832c-2.98-2.982-6.941-4.625-11.157-4.626-8.704 0-15.783 7.076-15.787 15.774-.001 2.981.814 5.892 2.363 8.431l.16.255-1.quietude.962 7.107 3.106-1.208-8.849-.302-.51a12.621 12.621 0 01-1.77-5.993c.004-6.989 5.713-12.679 12.726-12.679 3.4.001 6.6 1.325 9.001 3.729 2.399 2.402 3.721 5.6 3.72 9.001-.002 7.014-5.714 12.702-12.728 12.702-2.03-.001-3.99-.514-5.785-1.442l-.359-.192-3.729.979 1.009-3.671-.236-.374a12.643 12.643 0 01-1.932-6.78c.004-6.989 5.712-12.679 12.725-12.679"/>
    <path fill="#25D366" d="M31.707 29.204c-.363-.182-2.148-1.06-2.48-1.181-.333-.12-.576-.182-.817.182-.243.364-.936 1.182-1.148 1.424-.212.243-.425.273-.788.091-.363-.182-1.533-.565-2.92-1.803-1.079-.962-1.808-2.149-2.02-2.513-.211-.363-.022-.56.16-.741.163-.163.363-.424.544-.636.181-.212.242-.364.363-.606.121-.242.061-.454-.031-.636-.09-.182-.817-1.97-1.12-2.697-.295-.707-.595-.612-.817-.622-.212-.009-.454-.011-.697-.011-.242 0-.636.091-.969.454-.333.364-1.272 1.243-1.272 3.03 0 1.788 1.303 3.515 1.484 3.758.182.242 2.562 3.91 6.208 5.487.868.374 1.545.598 2.073.766.871.277 1.663.238 2.29.144.699-.104 2.148-.878 2.45-1.726.301-.848.301-1.575.211-1.726-.091-.152-.332-.243-.697-.424z"/>
  </svg>
)

const YouTubeLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <path fill="#FF0000" d="M44.898 14.559a5.637 5.637 0 00-3.966-3.99C37.24 9.5 24 9.5 24 9.5s-13.24 0-16.932 1.069a5.637 5.637 0 00-3.966 3.99C2 18.272 2 26 2 26s0 7.728 1.102 11.441a5.637 5.637 0 003.966 3.99C10.76 42.5 24 42.5 24 42.5s13.24 0 16.932-1.069a5.637 5.637 0 003.966-3.99C46 33.728 46 26 46 26s0-7.728-1.102-11.441z"/>
    <polygon fill="#FFFFFF" points="19.5,32 19.5,20 31,26"/>
  </svg>
)

const integrations: Integration[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Synchronisez vos leads Facebook Ads et vos pages business',
    category: 'Réseaux Sociaux',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    connected: false,
    logo: <MetaLogo />,
    connectUrl: 'https://developers.facebook.com/apps/',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Connectez votre compte Instagram Business pour le suivi des leads',
    category: 'Réseaux Sociaux',
    color: 'bg-pink-50',
    textColor: 'text-pink-700',
    connected: false,
    logo: <InstagramLogo />,
    connectUrl: 'https://business.instagram.com/',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Importez vos leads LinkedIn Sales Navigator et Campaign Manager',
    category: 'Réseaux Sociaux',
    color: 'bg-sky-50',
    textColor: 'text-sky-700',
    connected: false,
    logo: <LinkedInLogo />,
    connectUrl: 'https://www.linkedin.com/developers/apps',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Capturez les leads depuis vos campagnes TikTok for Business',
    category: 'Réseaux Sociaux',
    color: 'bg-slate-50',
    textColor: 'text-slate-700',
    connected: false,
    logo: <TikTokLogo />,
    connectUrl: 'https://ads.tiktok.com/',
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Synchronisez vos conversions et leads depuis Google Ads',
    category: 'Publicité',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    connected: false,
    logo: <GoogleAdsLogo />,
    connectUrl: 'https://ads.google.com/',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Envoyez des messages automatiques et gérez vos conversations',
    category: 'Messaging',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    connected: false,
    logo: <WhatsAppLogo />,
    connectUrl: 'https://business.whatsapp.com/',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Trackez les leads générés depuis vos vidéos YouTube',
    category: 'Vidéo',
    color: 'bg-red-50',
    textColor: 'text-red-700',
    connected: false,
    logo: <YouTubeLogo />,
    connectUrl: 'https://studio.youtube.com/',
  },
]

export default function AcquisitionPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({})

  const isConnected = (id: string) => !!connected[id]
  const totalConnected = Object.values(connected).filter(Boolean).length

  const categories = [...new Set(integrations.map(i => i.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Intégrations</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Connectez vos plateformes pour centraliser vos leads automatiquement
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-medium text-slate-700">{totalConnected} / {integrations.length} connectées</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(totalConnected / integrations.length) * 100}%` }}
        />
      </div>

      {/* Intégrations par catégorie */}
      {categories.map(category => (
        <div key={category}>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.filter(i => i.category === category).map(integration => {
              const active = isConnected(integration.id)
              return (
                <Card
                  key={integration.id}
                  className={`border transition-all duration-200 ${active ? 'border-green-300 bg-green-50/30' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`${integration.color} p-2 rounded-xl`}>
                          {integration.logo}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{integration.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {active ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">Connecté</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-3 h-3 text-slate-300" />
                                <span className="text-xs text-slate-400">Non connecté</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">{integration.description}</p>

                    <div className="flex items-center gap-2">
                      {active ? (
                        <button
                          onClick={() => setConnected(prev => ({ ...prev, [integration.id]: false }))}
                          className="flex-1 text-xs font-medium py-1.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Déconnecter
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (integration.connectUrl) window.open(integration.connectUrl, '_blank')
                            setConnected(prev => ({ ...prev, [integration.id]: true }))
                          }}
                          className="flex-1 text-xs font-medium py-1.5 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Connecter
                        </button>
                      )}
                      {integration.connectUrl && (
                        <a
                          href={integration.connectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {/* Info card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Intégrations API</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Ces intégrations nécessitent la configuration d'une API dans les réglages de chaque plateforme.
              Cliquez sur l'icône <ExternalLink className="w-3 h-3 inline" /> pour accéder directement à la console développeur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
