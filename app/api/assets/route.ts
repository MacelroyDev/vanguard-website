import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { auth } from '@clerk/nextjs/server'

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

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

        const assets = (response.Contents || []).map(item => ({
            id: item.Key,
            name: item.Key?.split('/').pop()?.replace(/-\d+\./, '.') || 'Unknown',
            url: `${process.env.R2_PUBLIC_URL}/${item.Key}`,
            created_at: item.LastModified,
        }))

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