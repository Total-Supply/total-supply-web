import { z } from 'zod'

import { ValidationError } from './errors'

export async function validateBody<T extends z.ZodTypeAny>(
  body: unknown,
  schema: T,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid request body', error.issues)
    }
    throw error
  }
}

export async function validateQuery<T extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: T,
): Promise<z.infer<T>> {
  try {
    const params = Object.fromEntries(searchParams.entries())
    return await schema.parseAsync(params)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid query parameters', error.issues)
    }
    throw error
  }
}

export async function validateParams<T extends z.ZodTypeAny>(
  params: unknown,
  schema: T,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(params)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid path parameters', error.issues)
    }
    throw error
  }
}

export function validate<T extends z.ZodTypeAny>(
  data: unknown,
  schema: T,
): z.infer<T> {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.issues)
    }
    throw error
  }
}
