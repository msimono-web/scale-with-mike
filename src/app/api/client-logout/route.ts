import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export async function POST(req: Request) {
  const { slug } = await req.json()
  const cookieStore = await cookies()
  const token = cookieStore.get(`swm-client-${slug}`)?.value

  if (token) {
    await supabase.from('client_sessions').delete().eq('token', token)
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(`swm-client-${slug}`, '', {
    maxAge: 0,
    path: `/client/${slug}`,
  })
  return res
}
