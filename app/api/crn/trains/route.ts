import { NextResponse } from 'next/server';
import { fetchSSE } from '@/lib/fetchSSE';

const CRN_SERVER = process.env.CRN_SERVER_URL;

export async function GET() {
  try {
    const data = await fetchSSE(`${CRN_SERVER}/api/trains.rt`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch trains:', error);
    return NextResponse.json(
      { error: String(error), trains: [] },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
