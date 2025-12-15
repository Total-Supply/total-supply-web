import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
})

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '')

export async function generateSignedUploadUrl(
  filename: string,
  contentType: string,
): Promise<{ url: string; publicUrl: string }> {
  const file = bucket.file(`uploads/${Date.now()}-${filename}`)

  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  })

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`

  return { url, publicUrl }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const filename = fileUrl.split('/').pop()
    if (filename) {
      await bucket.file(`uploads/${filename}`).delete()
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}
