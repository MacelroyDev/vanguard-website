import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        
        // Get clearance from public metadata, default to 1 (Civilian)
        const clearance = (user.publicMetadata?.clearance as number) || 1

        return NextResponse.json({ 
            clearance,
            userId,
        })

    } catch (error) {
        console.error('Error fetching clearance:', error)
        return NextResponse.json({ error: 'Failed to fetch clearance' }, { status: 500 })
    }
}