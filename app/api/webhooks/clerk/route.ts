import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET to your .env.local')
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Missing svix headers', { status: 400 })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Verify the webhook
    const wh = new Webhook(WEBHOOK_SECRET)
    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Invalid signature', { status: 400 })
    }

    // Handle the user.created event
    if (evt.type === 'user.created') {
        const { id } = evt.data

        try {
            const client = await clerkClient()
            
            // Set default clearance level to 1 (Civilian)
            await client.users.updateUserMetadata(id, {
                publicMetadata: {
                    clearance: 1,
                },
            })

            console.log(`Set clearance level 1 for new user: ${id}`)
        } catch (err) {
            console.error('Error setting user clearance:', err)
            return new Response('Error updating user metadata', { status: 500 })
        }
    }

    return new Response('Webhook processed', { status: 200 })
}