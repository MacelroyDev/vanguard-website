import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { auth } from '@clerk/nextjs/server'

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        const command = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET_NAME,
            Prefix: 'skins/',
            MaxKeys: 1000, // Get all, we'll paginate in memory
        })

        const response = await S3.send(command)

        const allAssets = (response.Contents || [])
            .filter(item => item.Key && item.Key !== 'skins/') // Filter out the folder itself
            .map(item => {
                const keyParts = item.Key?.split('/') || []
                const ownerId = keyParts[1] || 'unknown'
                const filename = keyParts[2] || 'unknown'
                
                // Extract the custom name from filename (format: customname-timestamp.ext)
                const nameMatch = filename.match(/^(.+)-\d+\./)
                const displayName = nameMatch ? nameMatch[1].replace(/-/g, ' ') : filename

                return {
                    id: item.Key,
                    name: displayName,
                    url: `${process.env.R2_PUBLIC_URL}/${item.Key}`,
                    ownerId: ownerId,
                    isOwner: ownerId === userId,
                    created_at: item.LastModified,
                }
            })
            .sort((a, b) => {
                // Sort by date, newest first
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
                return dateB - dateA
            })

        // Paginate
        const startIndex = (page - 1) * limit
        const paginatedAssets = allAssets.slice(startIndex, startIndex + limit)
        const totalPages = Math.ceil(allAssets.length / limit)

        return NextResponse.json({ 
            assets: paginatedAssets,
            pagination: {
                page,
                limit,
                total: allAssets.length,
                totalPages,
            }
        })

    } catch (error) {
        console.error('Error listing all assets:', error)
        return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 })
    }
}