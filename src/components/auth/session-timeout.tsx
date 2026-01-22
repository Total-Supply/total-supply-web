'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { useEffect, useMemo, useRef } from 'react'

const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000

export function SessionTimeout() {
  const { status } = useSession()
  const router = useRouter()
  const timeoutRef = useRef<number | null>(null)

  const activityEvents = useMemo(
    () => ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'],
    [],
  )

  useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    const clearTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }

    const startTimer = () => {
      clearTimer()
      timeoutRef.current = window.setTimeout(async () => {
        try {
          await fetch('/api/auth/signout', { method: 'POST' })
        } catch (error) {
          console.error('Signout audit failed', error)
        } finally {
          await signOut({ redirect: false })
          router.push('/login?reason=expired')
        }
      }, INACTIVITY_TIMEOUT_MS)
    }

    const handleActivity = () => {
      startTimer()
    }

    startTimer()
    activityEvents.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true }),
    )

    return () => {
      clearTimer()
      activityEvents.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      )
    }
  }, [activityEvents, router, status])

  return null
}


