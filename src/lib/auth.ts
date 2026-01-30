import prisma from '@/src/lib/prisma'
import { compare } from 'bcryptjs'
import { randomUUID } from 'crypto'
import type { NextAuthOptions, RequestInternal, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

type SessionWithExpired = Session & { expired?: boolean }

const DEFAULT_SESSION_MAX_AGE = 30 * 24 * 60 * 60
const REMEMBER_ME_MAX_AGE = 90 * 24 * 60 * 60

function parseRememberMe(value: unknown) {
  return value === true || value === 'true' || value === 'on' || value === '1'
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: REMEMBER_ME_MAX_AGE,
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' },
      },
      async authorize(
        credentials:
          | Record<'email' | 'rememberMe' | 'password', string>
          | undefined,
        req: Pick<RequestInternal, 'body' | 'query' | 'headers' | 'method'>,
      ) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
          select: {
            id: true,
            email: true,
            passwordHash: true,
            name: true,
            role: true,
            status: true,
            emailVerified: true,
            profileImage: true,
          },
        })

        if (!user) throw new Error('Invalid email or password')

        const isPasswordValid = await compare(
          String(credentials.password),
          user.passwordHash,
        )
        if (!isPasswordValid) throw new Error('Invalid email or password')

        if (!user.emailVerified) throw new Error('Email not verified')
        if (user.status === 'SUSPENDED') throw new Error('Account suspended')
        if (user.status === 'REJECTED') throw new Error('Account rejected')
        if (user.status === 'PENDING_APPROVAL')
          throw new Error('Account pending approval')

        const rememberMe = parseRememberMe(credentials.rememberMe)

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          image: user.profileImage,
          rememberMe,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        type AuthUser = {
          id: string | number
          role?: string
          status?: string
          rememberMe?: boolean
        }
        const typedUser = user as AuthUser
        token.id = String(typedUser.id)
        token.role = typedUser.role
        token.status = typedUser.status
        token.rememberMe = typedUser.rememberMe === true

        if (!token.sessionToken) {
          const now = Date.now()
          const maxAgeSeconds = token.rememberMe
            ? REMEMBER_ME_MAX_AGE
            : DEFAULT_SESSION_MAX_AGE

          token.sessionToken = randomUUID()
          token.sessionExpiresAt = now + maxAgeSeconds * 1000

          const userId = Number(typedUser.id)
          if (!Number.isNaN(userId)) {
            await prisma.session.create({
              data: {
                userId,
                token: token.sessionToken as string,
                expiresAt: new Date(token.sessionExpiresAt as number),
              },
            })
          }
        }
      }

      return token
    },

    async session({ session, token }) {
      // ✅ NEVER return null (type + stability). Mark expired instead.
      if (
        token.sessionExpiresAt &&
        Date.now() > Number(token.sessionExpiresAt)
      ) {
        if (token.sessionToken) {
          await prisma.session.deleteMany({
            where: { token: String(token.sessionToken) },
          })
        }

        session.expires = new Date(0).toISOString()
        ;(session as SessionWithExpired).expired = true
        session.user = {
          id: '',
          name: null,
          email: null,
          image: null,
          role: undefined,
          status: undefined,
          rememberMe: undefined,
        }
        return session
      }

      if (session.user) {
        type ExtendedUser = typeof session.user & {
          id?: string
          role?: string
          status?: string
          rememberMe?: boolean
        }
        const user = session.user as ExtendedUser
        user.id = token.id as string
        user.role = token.role as string | undefined
        user.status = token.status as string | undefined
        user.rememberMe = token.rememberMe === true
        session.user = user
      }

      if (token.sessionExpiresAt) {
        session.expires = new Date(Number(token.sessionExpiresAt)).toISOString()
      }

      return session
    },
  },
  events: {
    async signOut({ token }: { token: any }) {
      if (token?.sessionToken) {
        const userId = token.id

        // Clean up session in DB
        await prisma.session.deleteMany({
          where: { token: String(token.sessionToken) },
        })

        // Create Audit Log
        // Note: In events, we might not have access to Request headers for IP/UserAgent easily without invasive changes.
        // We will log what we can.
        if (userId) {
             const numericId = parseInt(String(userId))
             if (!isNaN(numericId)) {
                await prisma.auditLog.create({
                    data: {
                    entityType: 'USER',
                    entityId: numericId,
                    action: 'LOGOUT',
                    actorId: numericId,
                    details: { result: 'SUCCESS', method: 'NextAuth Event' },
                    },
                })
             }
        }
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
