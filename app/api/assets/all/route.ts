import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { auth } from '@clerk/nextjs/server'

// TODO: Server-side searching and filtering for assets is implemented here. However, client-side
// filtering is still needed for a smoother user experience. If the database grows, consider
// implementing server-side filtering in the future.

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

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const mobTypeFilter = searchParams.get('mobType') || 'all'
        const searchQuery = searchParams.get('search') || ''

        const command = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET_NAME,
            Prefix: 'skins/',
            MaxKeys: 1000,
        })

        const response = await S3.send(command)

        let allAssets = (response.Contents || [])
            .filter(item => {
                // Filter out folder entries
                if (!item.Key || item.Key === 'skins/') return false
                // Filter out user folder entries (e.g., 'skins/user_123/')
                const parts = item.Key.split('/')
                return parts.length === 3 && parts[2] !== ''
            })
            .map(item => {
                const keyParts = item.Key?.split('/') || []
                const ownerId = keyParts[1] || 'unknown'
                const filename = keyParts[2] || 'unknown'
                const { mobType, name } = parseFilename(filename)

                return {
                    id: item.Key,
                    name: name,
                    mobType: mobType,
                    url: `${process.env.R2_PUBLIC_URL}/${item.Key}`,
                    ownerId: ownerId,
                    isOwner: ownerId === userId,
                    created_at: item.LastModified,
                }
            })

        // Apply mob type filter
        if (mobTypeFilter !== 'all') {
            allAssets = allAssets.filter(asset => asset.mobType === mobTypeFilter)
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            allAssets = allAssets.filter(asset => 
                asset.name.toLowerCase().includes(query)
            )
        }

        // Sort by date, newest first
        allAssets.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
            return dateB - dateA
        })

        // Get total before pagination
        const total = allAssets.length

        // Paginate
        const startIndex = (page - 1) * limit
        const paginatedAssets = allAssets.slice(startIndex, startIndex + limit)
        const totalPages = Math.ceil(total / limit)

        return NextResponse.json({ 
            assets: paginatedAssets,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            }
        })

    } catch (error) {
        console.error('Error listing all assets:', error)
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
    }
}