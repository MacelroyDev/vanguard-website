import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return new NextResponse('Missing url', { status: 400 })
  }

  const res = await fetch(url)

  if (!res.ok) {
    return new NextResponse('Failed to fetch skin', { status: 500 })
  }

  return new NextResponse(res.body, {
    headers: {
      'Content-Type': 'image/png',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
