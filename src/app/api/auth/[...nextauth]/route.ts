import { authOptions } from '@/src/lib/auth'
import NextAuth from 'next-auth'

/**
 * NextAuth Handler
 * @description Internal NextAuth routes (callbacks/providers/session). Not part of public REST docs.
 * @ignore
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
