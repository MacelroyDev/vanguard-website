import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, DeleteObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3'
import { auth } from '@clerk/nextjs/server'

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

// Valid mob types
const VALID_MOB_TYPES = ['human', 'villager', 'zombie-villager', 'skeleton', 'allay', 'cat', 'chicken', 'iron-golem'];

// Parse filename to extract mob type and name
function parseFilename(filename: string): { mobType: string; name: string } {
    // New format: {mobType}_{name}-{timestamp}.{ext}
    const newFormatMatch = filename.match(/^([a-z-]+)_(.+)-\d+\./);
    if (newFormatMatch && VALID_MOB_TYPES.includes(newFormatMatch[1])) {
        return {
            mobType: newFormatMatch[1],
            name: newFormatMatch[2].replace(/-/g, ' ')
        };
    }

    // Old format: {name}-{timestamp}.{ext} (default to 'human')
    const oldFormatMatch = filename.match(/^(.+)-\d+\./);
    if (oldFormatMatch) {
        return {
            mobType: 'human',
            name: oldFormatMatch[1].replace(/-/g, ' ')
        };
    }

    // Fallback
    return {
        mobType: 'human',
        name: filename.split('.')[0]
    };
}

// GET - List user's assets from R2
export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const command = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET_NAME,
            Prefix: `skins/${userId}/`,
        })

        const response = await S3.send(command)

        const assets = (response.Contents || [])
            .filter(item => item.Key && item.Key !== `skins/${userId}/`)
            .map(item => {
                const filename = item.Key?.split('/').pop() || 'unknown'
                const { mobType, name } = parseFilename(filename)

                return {
                    id: item.Key,
                    name: name,
                    mobType: mobType,
                    url: `${process.env.R2_PUBLIC_URL}/${item.Key}`,
                    created_at: item.LastModified,
                }
            })
            .sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
                return dateB - dateA
            })

        return NextResponse.json({ assets })

    } catch (error) {
        console.error('Error listing assets:', error)
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
    }
}

// DELETE - Remove an asset from R2
export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const key = searchParams.get('key')

        if (!key) {
            return NextResponse.json({ error: 'Asset key required' }, { status: 400 })
        }

        // Security check: make sure the key belongs to this user
        if (!key.startsWith(`skins/${userId}/`)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        })

        await S3.send(command)

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error deleting asset:', error)
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 })
    }
}

// PATCH - Update asset metadata (rename, change mob type)
export async function PATCH(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { key, name, mobType } = await request.json()

        if (!key || !name || !mobType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate mob type
        if (!VALID_MOB_TYPES.includes(mobType)) {
            return NextResponse.json({ error: 'Invalid mob type' }, { status: 400 })
        }

        // Security check: make sure the key belongs to this user
        if (!key.startsWith(`skins/${userId}/`)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Get the file extension from the old key
        const extension = key.split('.').pop()

        // Sanitize the new name
        const sanitizedName = name
            .replace(/[^a-zA-Z0-9\s\-_]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .substring(0, 50)

        // Create new key with updated name and mob type
        const newKey = `skins/${userId}/${mobType}_${sanitizedName}-${Date.now()}.${extension}`

        // Copy the object to the new key
        await S3.send(new CopyObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            CopySource: `${process.env.R2_BUCKET_NAME}/${key}`,
            Key: newKey,
        }))

        // Delete the old object
        await S3.send(new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        }))

        const newUrl = `${process.env.R2_PUBLIC_URL}/${newKey}`

        return NextResponse.json({ 
            success: true,
            newKey,
            newUrl,
        })

    } catch (error) {
        console.error('Error updating asset:', error)
        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 })
    }
}