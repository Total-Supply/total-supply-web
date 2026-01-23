// src/lib/schemas/auth.ts
import { UserRole, UserStatus } from '@/generated/prisma'
import { z } from 'zod'

import {
  BadRequestResponse,
  ConflictResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from './common'

/**
 * Shared user shape returned by Auth endpoints
 */
export const AuthUserResponse = z
  .object({
    id: z.number().int().positive().describe('User ID'),
    email: z.string().email().describe('User email'),
    name: z.string().describe('User full name'),
    phone: z.string().nullable().optional().describe('Phone number (nullable)'),
    role: z.nativeEnum(UserRole).describe('User role'),
    status: z.nativeEnum(UserStatus).describe('Account status'),
    profileImage: z
      .string()
      .url()
      .nullable()
      .optional()
      .describe('Profile image URL (nullable)'),
    emailVerified: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .describe('Email verified timestamp (nullable)'),
    createdAt: z.string().datetime().optional().describe('Creation timestamp'),
    updatedAt: z
      .string()
      .datetime()
      .optional()
      .describe('Last update timestamp'),
  })
  .describe('User profile returned by authentication APIs')

/**
 * POST /auth/login
 */
export const LoginBody = z
  .object({
    email: z.string().email().describe('User email'),
    password: z.string().min(1).describe('User password'),
  })
  .describe('Login request body')

export const LoginSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      user: AuthUserResponse.describe('Authenticated user profile'),
    }),
    message: z.string().optional(),
  })
  .describe('Successful login response')

/**
 * GET /auth/me
 */
export const MeSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AuthUserResponse.extend({
      _count: z
        .object({
          orders: z.number().int().min(0).describe('Total orders count'),
          serviceRequests: z
            .number()
            .int()
            .min(0)
            .describe('Total service requests count'),
          addresses: z
            .number()
            .int()
            .min(0)
            .describe('Total saved addresses count'),
        })
        .describe('Entity count summary'),
    }),
    message: z.string().optional(),
  })
  .describe('Authenticated user full profile response')

/**
 * POST /auth/forgot-password
 */
export const ForgotPasswordBody = z
  .object({
    email: z.string().email().describe('User email address'),
  })
  .describe('Forgot password request body')

export const ForgotPasswordSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      email: z.string().email().describe('Requested email address'),
    }),
    message: z.string().optional(),
  })
  .describe(
    'Forgot password response (always returns success even if email does not exist)',
  )

/**
 * POST /auth/register
 */
export const RegisterBody = z
  .object({
    email: z.string().email().describe('User email address'),
    password: z.string().min(8).describe('User password'),
    name: z.string().min(2).describe('User name'),
    phone: z.string().optional().describe('Phone number (optional)'),
    recaptchaToken: z
      .string()
      .optional()
      .describe('reCAPTCHA token (optional)'),
  })
  .describe('User registration request body')

export const RegisterSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      id: z.number().int().positive().describe('New user ID'),
      email: z.string().email().describe('Registered email'),
      name: z.string().describe('Registered name'),
      role: z.nativeEnum(UserRole).describe('Assigned role'),
      status: z.nativeEnum(UserStatus).describe('Assigned status'),
      createdAt: z.string().datetime().describe('Created timestamp'),
    }),
    message: z.string().optional(),
  })
  .describe('Successful registration response')

/**
 * POST /auth/resend-verification
 */
export const ResendVerificationBody = z
  .object({
    email: z.string().email().describe('User email address'),
  })
  .describe('Resend verification request body')

export const ResendVerificationSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      email: z.string().email().describe('Requested email address'),
    }),
    message: z.string().optional(),
  })
  .describe('Resend verification response')

/**
 * POST /auth/reset-password
 */
export const ResetPasswordBody = z
  .object({
    token: z.string().min(10).describe('Password reset token'),
    password: z.string().min(8).describe('New password'),
  })
  .describe('Reset password request body')

export const ResetPasswordSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      email: z.string().email().describe('User email address'),
    }),
    message: z.string().optional(),
  })
  .describe('Reset password response')

/**
 * POST /auth/verify-email
 */
export const VerifyEmailBody = z
  .object({
    token: z.string().min(10).describe('Email verification token'),
  })
  .describe('Verify email request body')

export const VerifyEmailSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.object({
      email: z.string().email().describe('User email address'),
      alreadyVerified: z
        .boolean()
        .optional()
        .describe('True if email was already verified'),
    }),
    message: z.string().optional(),
  })
  .describe('Verify email response')

/**
 * PUT /auth/update-profile
 */
export const UpdateProfileBody = z
  .object({
    name: z.string().min(2).optional().describe('Updated name'),
    phone: z.string().optional().describe('Updated phone'),
    profileImage: z.string().url().optional().describe('Profile image URL'),
  })
  .describe('Update profile request body')

export const UpdateProfileSuccessResponse = z
  .object({
    success: z.literal(true),
    data: AuthUserResponse.pick({
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      profileImage: true,
      updatedAt: true,
    }),
    message: z.string().optional(),
  })
  .describe('Update profile response')

/**
 * POST /auth/signout
 */
export const SignoutSuccessResponse = z
  .object({
    success: z.literal(true),
    data: z.null(),
    message: z.string().optional(),
  })
  .describe('Signout response')

// Export error schemas so OpenAPI generator includes them
export {
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ConflictResponse,
  ValidationErrorResponse,
  InternalServerErrorResponse,
}
