import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'


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
        const { searchParams } = new URL(request.url)
        const name = searchParams.get('name')

        if (!name) {
            return new NextResponse('Missing map name', { status: 400 })
        }

        // Prevent path traversal
        if (name.includes('..') || name.includes('/')) {
            return new NextResponse('Invalid map name', { status: 400 })
        }

        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `${name}`,
        })

        const response = await S3.send(command)

        if (!response.Body) {
            return new NextResponse('Map not found', { status: 404 })
        }

        return new NextResponse(response.Body as ReadableStream, {
            headers: {
                'Content-Type': response.ContentType || 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })

    } catch (error: any) {
        console.error('Error fetching server map:', error)

        if (error?.$metadata?.httpStatusCode === 404) {
            return new NextResponse('Map not found', { status: 404 })
        }

        return new NextResponse('Failed to fetch map', { status: 500 })
    }
}
