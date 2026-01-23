import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

const STYLES_KEY = 'track-styles.json'

const DEFAULT_DATA = {
    version: 1,
    lastModified: new Date().toISOString(),
    styles: {},
}

// GET - Load track styles
export async function GET() {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: STYLES_KEY,
        })

        const response = await S3.send(command)

        if (!response.Body) {
            return NextResponse.json(DEFAULT_DATA)
        }

        // Convert stream to string
        const bodyString = await response.Body.transformToString()
        const data = JSON.parse(bodyString)

        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Error fetching track styles:', error)

        // If file doesn't exist, return default empty data
        if (error?.$metadata?.httpStatusCode === 404 || error?.name === 'NoSuchKey') {
            return NextResponse.json(DEFAULT_DATA)
        }

        return NextResponse.json(
            { error: 'Failed to fetch track styles' },
            { status: 500 }
        )
    }
}

// POST - Save track styles
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()

        // Validate the data structure
        if (!data.styles || typeof data.styles !== 'object') {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            )
        }

        // Add metadata
        const saveData = {
            version: data.version || 1,
            lastModified: new Date().toISOString(),
            styles: data.styles,
        }

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: STYLES_KEY,
            Body: JSON.stringify(saveData, null, 2),
            ContentType: 'application/json',
        })

        await S3.send(command)

        return NextResponse.json({ 
            success: true, 
            lastModified: saveData.lastModified 
        })

    } catch (error: any) {
        console.error('Error saving track styles:', error)
        return NextResponse.json(
            { error: 'Failed to save track styles' },
            { status: 500 }
        )
    }
}

// DELETE - Clear all track styles (optional)
export async function DELETE() {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: STYLES_KEY,
            Body: JSON.stringify(DEFAULT_DATA, null, 2),
            ContentType: 'application/json',
        })

        await S3.send(command)

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Error clearing track styles:', error)
        return NextResponse.json(
            { error: 'Failed to clear track styles' },
            { status: 500 }
        )
    }
}