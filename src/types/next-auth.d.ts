import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string
      role?: string
      status?: string
      rememberMe?: boolean
    }
  }

  interface User extends DefaultUser {
    role?: string
    status?: string
    rememberMe?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    status?: string
    rememberMe?: boolean
    sessionToken?: string
    sessionExpiresAt?: number
  }
}


