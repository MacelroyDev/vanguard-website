import { NextResponse } from 'next/server';
import { fetchSSE } from '@/lib/fetchSSE';

const CRN_SERVER = process.env.CRN_SERVER_URL;

export async function GET() {
  try {
    const data = await fetchSSE(`${CRN_SERVER}/api/blocks.rt`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch blocks:', error);
    return NextResponse.json(
      { error: String(error), blocks: [] },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
