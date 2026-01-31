import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // 1. Check if user is authenticated for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Not logged in -> Redirect to Login
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', encodeURI(req.url))
      return NextResponse.redirect(url)
    }

    const role = token.role as string

    // 2. Role-Based Access Control logic
    // CUSTOMER -> Block access to dashboard entirely
    if (role === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Role-Specific Sub-routes
    // ADMIN -> /dashboard/admin (and /dashboard/it as per prompt implication, but primarily admin)
    // We allow ADMIN to access everything for now effectively, or strictly /dashboard/admin?
    // The prompt lists: "ADMIN src\app\dashboard\admin", "SALESMAN src\app\dashboard\salesman", etc.
    // Let's enforce strict paths where possible to avoid confusion, but commonly admins need access.
    // However, the prompt says "admin can be access the so chek tehtem...".
    // I will implement a check: if you are ROLE X, you should be in /dashboard/ROLE_X (mostly).

    // Simple mapping check
    if (role === 'ADMIN' && !pathname.startsWith('/dashboard/admin') && !pathname.startsWith('/dashboard/it') &&  pathname !== '/dashboard') {
        // Admin might want to see other things, but prompt emphasizes specific folders. 
        // Let's NOT start blocking Admin from other dashboards unless strictly required. 
        // But for OTHER roles, we MUST block.
    }

    if (role === 'SALESMAN' && !pathname.startsWith('/dashboard/salesman') && pathname !== '/dashboard') {
        return NextResponse.redirect(new URL('/dashboard/salesman', req.url))
    }
    
    if (role === 'DRIVER' && !pathname.startsWith('/dashboard/driver') && pathname !== '/dashboard') {
        return NextResponse.redirect(new URL('/dashboard/driver', req.url))
    }

    if (role === 'CLEANER' && !pathname.startsWith('/dashboard/cleaner') && pathname !== '/dashboard') {
       return NextResponse.redirect(new URL('/dashboard/cleaner', req.url))
    }

    if (role === 'IT_STAFF' && !pathname.startsWith('/dashboard/it') && pathname !== '/dashboard') {
       return NextResponse.redirect(new URL('/dashboard/it', req.url))
    }
    
    // 3. Handle Root /dashboard access -> Redirect to specific dashboard
    if (pathname === '/dashboard') {
      switch (role) {
        case 'ADMIN':
          return NextResponse.redirect(new URL('/dashboard/admin', req.url))
        case 'SALESMAN':
          return NextResponse.redirect(new URL('/dashboard/salesman', req.url))
        case 'DRIVER':
          return NextResponse.redirect(new URL('/dashboard/driver', req.url))
        case 'CLEANER':
          return NextResponse.redirect(new URL('/dashboard/cleaner', req.url))
        case 'IT_STAFF':
          return NextResponse.redirect(new URL('/dashboard/it', req.url))
        default:
          return NextResponse.redirect(new URL('/', req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
