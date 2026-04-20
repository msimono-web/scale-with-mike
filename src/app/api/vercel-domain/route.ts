import { NextResponse } from 'next/server'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID

export async function POST(req: Request) {
  const { domain } = await req.json()

  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json(
      { error: 'VERCEL_TOKEN et VERCEL_PROJECT_ID requis dans .env.local' },
      { status: 503 }
    )
  }

  if (!domain) return NextResponse.json({ error: 'Domaine requis' }, { status: 400 })

  try {
    const res = await fetch(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: domain }),
      }
    )
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message ?? 'Erreur Vercel' }, { status: res.status })
    }

    return NextResponse.json({ ok: true, domain: data })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur réseau' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { domain } = await req.json()

  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ error: 'Variables Vercel manquantes' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    )

    return NextResponse.json({ ok: res.ok })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erreur réseau' }, { status: 500 })
  }
}
