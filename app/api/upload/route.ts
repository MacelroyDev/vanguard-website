import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { auth } from '@clerk/nextjs/server'

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const customName = formData.get('customName') as string || file.name

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large' }, { status: 400 })
        }

        // Sanitize custom name (remove special characters, keep alphanumeric, spaces, hyphens, underscores)
        const sanitizedName = customName
            .replace(/[^a-zA-Z0-9\s\-_]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .substring(0, 50) // Limit length

        // Get file extension
        const extension = file.name.split('.').pop()
        
        // Generate filename with custom name
        const filename = `skins/${userId}/${sanitizedName}-${Date.now()}.${extension}`

        const buffer = Buffer.from(await file.arrayBuffer())

        await S3.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        }))

        const url = `${process.env.R2_PUBLIC_URL}/${filename}`

        return NextResponse.json({
            success: true,
            url,
            filename: customName || file.name,
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ 
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}