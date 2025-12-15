import { z } from 'zod'

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

export const ALL_ALLOWED_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
] as const

export const uploadSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename too long')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Filename contains invalid characters'),
  contentType: z.enum(ALL_ALLOWED_TYPES, {
    errorMap: () => ({ message: 'Invalid file type' }),
  }),
  fileSize: z
    .number()
    .min(1, 'File cannot be empty')
    .max(5 * 1024 * 1024, 'File size must be less than 5MB'),
})

export const imageUploadSchema = uploadSchema.extend({
  contentType: z.enum(ALLOWED_IMAGE_TYPES, {
    errorMap: () => ({ message: 'Invalid image type' }),
  }),
})

export const documentUploadSchema = uploadSchema.extend({
  contentType: z.enum(ALLOWED_DOCUMENT_TYPES, {
    errorMap: () => ({ message: 'Invalid document type' }),
  }),
})

export type UploadInput = z.infer<typeof uploadSchema>
export type ImageUploadInput = z.infer<typeof imageUploadSchema>
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>
