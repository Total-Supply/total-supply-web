import prisma from '@/src/lib/prisma'
import { compare } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const DEFAULT_SESSION_MAX_AGE = 30 * 24 * 60 * 60
const REMEMBER_ME_MAX_AGE = 90 * 24 * 60 * 60

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
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

        if (!user) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash,
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        if (!user.emailVerified) {
          throw new Error('Email not verified')
        }

        if (user.status === 'SUSPENDED') {
          throw new Error('Account suspended')
        }

        if (user.status === 'REJECTED') {
          throw new Error('Account rejected')
        }

        if (user.status === 'PENDING_APPROVAL') {
          throw new Error('Account pending approval')
        }

        const rememberMe =
          credentials.rememberMe === true ||
          credentials.rememberMe === 'true'

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
        token.id = user.id
        token.role = (user as any).role
        token.status = (user as any).status
        token.rememberMe = (user as any).rememberMe === true
        if (!token.sessionToken) {
          const now = Date.now()
          const maxAgeSeconds = token.rememberMe
            ? REMEMBER_ME_MAX_AGE
            : DEFAULT_SESSION_MAX_AGE
          token.sessionToken = randomUUID()
          token.sessionExpiresAt = now + maxAgeSeconds * 1000

          const userId = Number(user.id)
          if (!Number.isNaN(userId)) {
            await prisma.session.create({
              data: {
                userId,
                token: token.sessionToken,
                expiresAt: new Date(token.sessionExpiresAt),
              },
            })
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (
        token.sessionExpiresAt &&
        Date.now() > Number(token.sessionExpiresAt)
      ) {
        if (token.sessionToken) {
          await prisma.session.deleteMany({
            where: { token: token.sessionToken },
          })
        }
        return null
      }
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).status = token.status
        ;(session.user as any).rememberMe = token.rememberMe === true
      }
      if (token.sessionExpiresAt) {
        session.expires = new Date(
          Number(token.sessionExpiresAt),
        ).toISOString()
      }
      return session
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.sessionToken) {
        await prisma.session.deleteMany({
          where: { token: token.sessionToken as string },
        })
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}


