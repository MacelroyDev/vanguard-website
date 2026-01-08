import { NextResponse } from 'next/server';
import { status } from 'minecraft-server-util';

async function checkMinecraftServer(host: string, port: number = 25565, timeout: number = 5000): Promise<{
online: boolean;
players?: { online: number; max: number };
version?: string;
}> {
try {
	const response = await status(host, port, { timeout });
	return {
	online: true,
	players: {
		online: response.players.online,
		max: response.players.max,
	},
	version: response.version.name,
	};
} catch {
	return { online: false };
}
}

async function checkTransitServer(url: string, timeout: number = 5000): Promise<boolean> {
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeout);

try {
	const response = await fetch(url, {
	method: 'GET',
	signal: controller.signal,
	cache: 'no-store',
	});
	clearTimeout(timeoutId);
	return response.ok;
} catch {
	clearTimeout(timeoutId);
	return false;
}
}

export async function GET() {

	const CRN_SERVER = process.env.CRN_SERVER_URL;
	const MC_SERVER = process.env.MC_SERVER_URL;

	const [minecraftStatus, transitStatus] = await Promise.all([
		checkMinecraftServer(`${MC_SERVER}`), 
		checkTransitServer(`${CRN_SERVER}`),
	]);

	return NextResponse.json({
		minecraft: {
		online: minecraftStatus.online,
		players: minecraftStatus.players || null,
		version: minecraftStatus.version || null,
		},
		transit: transitStatus,
		checkedAt: new Date().toISOString(),
	});
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';