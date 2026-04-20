import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ALLOWED_EMAILS = ['m.simono@groupe-fc.com', 'y.brami@groupe-fc.com']
const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'scale-with-mike.vercel.app'

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl
  const host = req.headers.get('host') ?? ''

  // ── 0. REDIRECT OAuth code from root to /auth/callback ─────────────────────
  if (pathname === '/' && searchParams.has('code') && !searchParams.has('type')) {
    const callbackUrl = new URL('/auth/callback', req.url)
    callbackUrl.search = req.nextUrl.search
    return NextResponse.redirect(callbackUrl)
  }

  // ── 1. ROUTAGE SOUS-DOMAINES ET DOMAINES PERSONNALISÉS ──────────────────────

  const isSubdomain =
    host !== APP_DOMAIN &&
    !host.startsWith('localhost') &&
    !host.startsWith('192.168') &&
    host.endsWith(`.${APP_DOMAIN}`)

  if (isSubdomain) {
    const slug = host.split('.')[0]
    const url = req.nextUrl.clone()
    url.pathname = `/client/${slug}${pathname}`
    return NextResponse.rewrite(url)
  }

  const isCustomDomain =
    host !== APP_DOMAIN &&
    !host.startsWith('localhost') &&
    !host.startsWith('192.168') &&
    !host.endsWith(`.${APP_DOMAIN}`)

  if (isCustomDomain) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    if (supabaseUrl && supabaseKey) {
      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/client_spaces_auth?custom_domain=eq.${encodeURIComponent(host)}&select=slug`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        )
        const rows = await res.json()
        if (Array.isArray(rows) && rows[0]?.slug) {
          const slug = rows[0].slug
          const url = req.nextUrl.clone()
          url.pathname = `/client/${slug}${pathname}`
          return NextResponse.rewrite(url)
        }
      } catch { /* ignore */ }
    }
  }

  // ── 2. AUTH DASHBOARD PRINCIPAL ─────────────────────────────────────────────

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/pipeline') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/tasks') ||
    pathname.startsWith('/articles') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/invoices') ||
    pathname.startsWith('/communication') ||
    pathname.startsWith('/leaderboard') ||
    pathname.startsWith('/acquisition')

  if (isProtectedRoute) {
    const res = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'key',
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (c) => c.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
        },
      }
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (!session || !ALLOWED_EMAILS.includes(session.user.email ?? '')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  // ── 3. AUTH DASHBOARD CLIENT ─────────────────────────────────────────────────

  const clientDashboardMatch = pathname.match(
    /^\/client\/([^/]+)\/(dashboard|leads|pipeline|appointments|tasks|settings|articles|analytics|invoices|communication|leaderboard|acquisition)/
  )

  if (clientDashboardMatch) {
    const slug = clientDashboardMatch[1]
    const token = req.cookies.get(`swm-client-${slug}`)?.value
    if (!token) {
      return NextResponse.redirect(new URL(`/client/${slug}/login`, req.url))
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    if (supabaseUrl && supabaseKey) {
      try {
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/client_sessions?token=eq.${encodeURIComponent(token)}&slug=eq.${encodeURIComponent(slug)}&select=expires_at`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        )
        const sessions = await checkRes.json()
        if (!Array.isArray(sessions) || sessions.length === 0) {
          return NextResponse.redirect(new URL(`/client/${slug}/login`, req.url))
        }
        if (new Date(sessions[0].expires_at) < new Date()) {
          return NextResponse.redirect(new URL(`/client/${slug}/login`, req.url))
        }
      } catch { /* Si Supabase indisponible, laisser passer */ }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/leads/:path*',
    '/pipeline/:path*',
    '/settings/:path*',
    '/appointments/:path*',
    '/tasks/:path*',
    '/articles/:path*',
    '/analytics/:path*',
    '/invoices/:path*',
    '/communication/:path*',
    '/leaderboard/:path*',
    '/acquisition/:path*',
    '/client/:slug/dashboard/:path*',
    '/client/:slug/leads/:path*',
    '/client/:slug/pipeline/:path*',
    '/client/:slug/appointments/:path*',
    '/client/:slug/tasks/:path*',
    '/client/:slug/settings/:path*',
    '/client/:slug/articles/:path*',
    '/client/:slug/analytics/:path*',
    '/client/:slug/invoices/:path*',
    '/client/:slug/communication/:path*',
    '/client/:slug/leaderboard/:path*',
    '/client/:slug/acquisition/:path*',
  ],
}
