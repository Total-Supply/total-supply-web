import { z } from 'zod'

import { ValidationError } from './errors'

export async function validateBody<T extends z.ZodType>(
  body: unknown,
  schema: T,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid request body', error.errors)
    }
    throw error
  }
}

export async function validateQuery<T extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: T,
): Promise<z.infer<T>> {
  try {
    const params = Object.fromEntries(searchParams.entries())
    return await schema.parseAsync(params)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid query parameters', error.errors)
    }
    throw error
  }
}

export async function validateParams<T extends z.ZodType>(
  params: unknown,
  schema: T,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(params)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid path parameters', error.errors)
    }
    throw error
  }
}

export function validate<T extends z.ZodType>(
  data: unknown,
  schema: T,
): z.infer<T> {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors)
    }
    throw error
  }
}
