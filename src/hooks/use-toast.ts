'use client'

import { toaster } from '@/src/components/ui/toaster'

import type { ReactNode } from 'react'
import { useCallback } from 'react'

export type ToastStatus = 'success' | 'error' | 'warning' | 'info' | 'loading'
export type ToastPosition =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'

export type UseToastOptions = {
  id?: string | number
  title?: ReactNode
  description?: ReactNode
  status?: ToastStatus
  duration?: number
  isClosable?: boolean
  position?: ToastPosition
  render?: () => ReactNode
}

export function useToast() {
  return useCallback((options: UseToastOptions) => {
    const { id, title, description, status, duration, isClosable, render } =
      options

    return toaster.create({
      id: id ? String(id) : undefined,
      title,
      description,
      type: status,
      duration,
      closable: isClosable,
      meta: render ? { render } : undefined,
    })
  }, [])
}
