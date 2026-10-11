import { createHash } from 'node:crypto'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import env from '#start/env'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export type UploadFolder = 'cultures' | 'myths' | 'writings'

const UPLOAD_FOLDERS: UploadFolder[] = ['cultures', 'myths', 'writings']

export class UploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UploadError'
  }
}

/**
 * Single entry point for image uploads.
 *
 * STORAGE_DRIVER=cloudinary → signed multipart upload to Cloudinary
 * STORAGE_DRIVER=local (default) → writes to public/<folder> (ephemeral in
 * production — the app pod has no volume).
 */
export class UploadService {
  static isValidFolder(value: unknown): value is UploadFolder {
    return typeof value === 'string' && UPLOAD_FOLDERS.includes(value as UploadFolder)
  }

  static async uploadImage(
    file: MultipartFile,
    folder: UploadFolder
  ): Promise<{ url: string; publicId: string | null }> {
    if (env.get('STORAGE_DRIVER') === 'cloudinary') {
      return this.uploadToCloudinary(file, folder)
    }
    return this.uploadToDisk(file, folder)
  }

  /**
   * Best-effort cleanup of a previously uploaded cloudinary asset.
   * Non-cloudinary URLs are ignored. Never throws.
   */
  static async destroyByUrl(url: string | null | undefined): Promise<void> {
    if (!url || !url.includes('res.cloudinary.com')) return

    try {
      const publicId = this.publicIdFromUrl(url)
      if (!publicId) return

      const cloudName = env.get('CLOUDINARY_CLOUD_NAME')
      const apiKey = env.get('CLOUDINARY_API_KEY')
      const apiSecret = env.get('CLOUDINARY_API_SECRET')
      if (!cloudName || !apiKey || !apiSecret) return

      const timestamp = Math.floor(Date.now() / 1000)
      const signature = this.sign({ public_id: publicId, timestamp }, apiSecret)

      const body = new URLSearchParams({
        public_id: publicId,
        timestamp: String(timestamp),
        api_key: apiKey,
        signature,
      })
      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body,
      })
    } catch (error) {
      console.warn('Cloudinary destroy failed:', error)
    }
  }

  private static async uploadToCloudinary(
    file: MultipartFile,
    folder: UploadFolder
  ): Promise<{ url: string; publicId: string }> {
    const cloudName = env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = env.get('CLOUDINARY_API_KEY')
    const apiSecret = env.get('CLOUDINARY_API_SECRET')
    if (!cloudName || !apiKey || !apiSecret) {
      throw new UploadError(
        'STORAGE_DRIVER=cloudinary but CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET is missing'
      )
    }
    const tmpPath = file.tmpPath
    if (!tmpPath) {
      throw new UploadError('Uploaded file has no temp path')
    }

    const cloudFolder = `african-myths/${env.get('NODE_ENV')}/${folder}`
    const publicId = cuid()
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = this.sign({ folder: cloudFolder, public_id: publicId, timestamp }, apiSecret)

    const fileBuffer = await import('node:fs/promises').then((fs) => fs.readFile(tmpPath))

    const form = new FormData()
    form.append('file', new Blob([fileBuffer]), file.clientName)
    form.append('api_key', apiKey)
    form.append('timestamp', String(timestamp))
    form.append('folder', cloudFolder)
    form.append('public_id', publicId)
    form.append('signature', signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: form,
    })
    if (!response.ok) {
      const body = await response.text()
      const text = body.slice(0, 300)
      throw new UploadError(`Cloudinary upload failed (HTTP ${response.status}): ${text}`)
    }

    const json = (await response.json()) as { secure_url?: string; public_id?: string }
    if (!json.secure_url || !json.public_id) {
      throw new UploadError('Cloudinary upload response missing secure_url')
    }
    return { url: json.secure_url, publicId: json.public_id }
  }

  private static async uploadToDisk(
    file: MultipartFile,
    folder: UploadFolder
  ): Promise<{ url: string; publicId: null }> {
    const fileName = `${cuid()}.${file.extname}`
    await file.move(app.makePath(`public/${folder}`), {
      name: fileName,
      overwrite: true,
    })
    return { url: `/${folder}/${fileName}`, publicId: null }
  }

  /**
   * Cloudinary signed-request signature: sha1 of the alphabetically sorted
   * "key=value&..." params plus the API secret.
   */
  private static sign(params: Record<string, string | number>, apiSecret: string): string {
    const toSign =
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join('&') + apiSecret
    return createHash('sha1').update(toSign).digest('hex')
  }

  /**
   * .../upload/v1234/african-myths/dev/cultures/abc123.jpg
   *   → african-myths/dev/cultures/abc123
   */
  private static publicIdFromUrl(url: string): string | null {
    const match = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/.exec(url)
    return match?.[1] ?? null
  }
}
