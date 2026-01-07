import { NextResponse } from 'next/server';
import { fetchSSE } from '@/lib/fetchSSE';

const CRN_SERVER = process.env.CRN_SERVER_URL;

export async function GET() {
  try {
    const data = await fetchSSE(`${CRN_SERVER}/api/network.rt`);
    console.log('Network loaded, tracks:', data.tracks?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch network:', error);
    return NextResponse.json(
      { error: String(error), tracks: [] },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
