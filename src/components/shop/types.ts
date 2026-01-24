export type ShopItem = {
  id: number
  name: string
  slug: string
  price: number
  stock: number
  mainImageUrl?: string | null
  description?: string | null
}

export type CategoryFilter = {
  id: number
  name: string
  slug: string
  itemCount: number
}

export type FoodImage = {
  id: number
  url: string
}

export type FoodCategory = {
  id: number
  name: string
  slug: string
}

export type FoodItemDetail = {
  id: number
  name: string
  slug: string
  description: string | null
  ingredients: string | null
  nutritionInfo: string | null
  price: number | string
  stock: number
  mainImageUrl?: string | null
  images?: FoodImage[]
  categories?: FoodCategory[]
  category?: FoodCategory
}

export type RelatedItem = {
  id: number
  name: string
  slug: string
  price: number | string
  stock: number
  mainImageUrl?: string | null
}
