'use client'

import { store } from '@/src/store'
import { hydrateCart } from '@/src/store/slices/cartSlice'
import { Provider } from 'react-redux'

import { ReactNode, useEffect } from 'react'

interface ReduxProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'total-supply-cart'

export function ReduxProvider({ children }: ReduxProviderProps) {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.items) {
          store.dispatch(hydrateCart(parsed.items))
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.cart.items }),
      )
    })

    return () => unsubscribe()
  }, [])

  return <Provider store={store}>{children}</Provider>
}


