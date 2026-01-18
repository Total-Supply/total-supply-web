import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface CartItem {
  id: number
  name: string
  slug?: string
  price: number
  quantity: number
  image?: string | null
  stock?: number | null
}

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = {
  items: [],
  total: 0,
}

const clampQuantity = (quantity: number, max?: number | null) => {
  const safeMax = max && max > 0 ? Math.min(max, 100) : 100
  return Math.min(safeMax, Math.max(1, quantity))
}

const recalcTotal = (state: CartState) => {
  state.total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      )
      const incomingQuantity = clampQuantity(
        action.payload.quantity,
        action.payload.stock,
      )

      if (existingItem) {
        const maxAllowed = clampQuantity(100, existingItem.stock)
        existingItem.quantity = clampQuantity(
          existingItem.quantity + incomingQuantity,
          maxAllowed,
        )
      } else {
        state.items.push({
          ...action.payload,
          quantity: incomingQuantity,
        })
      }

      recalcTotal(state)
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      recalcTotal(state)
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = clampQuantity(action.payload.quantity, item.stock)
        recalcTotal(state)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = (action.payload || []).map((item) => ({
        ...item,
        quantity: clampQuantity(item.quantity, item.stock),
      }))
      recalcTotal(state)
    },
    syncCartItems: (
      state,
      action: PayloadAction<
        { id: number; price: number; stock: number; name?: string; image?: string | null; slug?: string }[]
      >,
    ) => {
      action.payload.forEach((update) => {
        const item = state.items.find((entry) => entry.id === update.id)
        if (!item) return
        item.price = update.price
        item.stock = update.stock
        if (update.name) item.name = update.name
        if (update.slug) item.slug = update.slug
        if (update.image !== undefined) item.image = update.image
        item.quantity = clampQuantity(item.quantity, update.stock)
      })
      recalcTotal(state)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  hydrateCart,
  syncCartItems,
} = cartSlice.actions
export default cartSlice.reducer


