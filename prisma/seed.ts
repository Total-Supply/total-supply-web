import { PrismaClient, ServiceCategory, ServiceType } from '@/generated/prisma'
import { PrismaNeon } from '@prisma/adapter-neon'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
if (!connectionString) {
  throw new Error(
    'DATABASE_URL or DIRECT_URL must be set before running the seed script',
  )
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString,
  }),
})

const foodCategories = [
  {
    name: 'Freshly Prepared Meals',
    slug: 'freshly-prepared-meals',
    description: 'Chef-prepared dishes delivered warm and ready to plate.',
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Freshly Baked Goods',
    slug: 'freshly-baked-goods',
    description:
      'Artisan breads, pastries, and comfort-forward bakes from our in-house oven.',
    imageUrl:
      'https://images.unsplash.com/photo-1505253758473-7a7ba8af3c6f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Chilled Beverages',
    slug: 'chilled-beverages',
    description:
      'House-made cold brews, teas, and smoothies with locally sourced ingredients.',
    imageUrl:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80',
  },
]

type FoodItemSeed = {
  name: string
  slug: string
  description?: string
  ingredients?: string
  nutritionInfo?: string
  price: number
  sku: string
  stock: number
  isActive?: boolean
  categorySlug: string
  additionalCategorySlugs?: string[]
  mainImageUrl?: string
  imageUrls?: string[]
}

const foodItems: FoodItemSeed[] = [
  {
    name: 'Grilled Herb Chicken Bowl',
    slug: 'grilled-herb-chicken-bowl',
    description:
      'Marinated free-range chicken with roasted vegetables and a citrus herbed drizzle.',
    ingredients:
      'Chicken thigh, roasted pumpkin, tahini drizzle, lemon, baby kale, wild rice',
    nutritionInfo: 'Protein 36g, Carbs 42g, Fat 14g',
    price: 1899.0,
    sku: 'TS-GHCB-001',
    stock: 48,
    isActive: true,
    categorySlug: 'freshly-prepared-meals',
    additionalCategorySlugs: ['chilled-beverages'],
    mainImageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Wild Herb Flatbread',
    slug: 'wild-herb-flatbread',
    description:
      'Sourdough flatbread layered with roasted garlic butter, seasonal greens, and feta crumble.',
    ingredients:
      'Sourdough flour blend, garlic confit, rosemary oil, feta, baby arugula, lemon zest',
    nutritionInfo: 'Calories 520, Protein 11g, Carb 56g',
    price: 1299.5,
    sku: 'TS-WHF-002',
    stock: 64,
    categorySlug: 'freshly-baked-goods',
    additionalCategorySlugs: ['freshly-prepared-meals'],
    mainImageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478144592103-25e218a04891?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Cold Brew Hibiscus Tonic',
    slug: 'cold-brew-hibiscus-tonic',
    description:
      'Slow-steeped cold brew paired with tangy hibiscus, lime, and sparkling mineral water.',
    ingredients:
      'Dark roast cold brew, hibiscus syrup, lime, sparkling mineral water',
    nutritionInfo: 'Calories 90, Caffeine 120mg',
    price: 799.0,
    sku: 'TS-HBT-003',
    stock: 120,
    categorySlug: 'chilled-beverages',
    mainImageUrl:
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    ],
  },
]

const serviceOfferings = [
  {
    name: 'Home Deep Clean',
    slug: 'home-deep-clean',
    type: ServiceType.CLEANING,
    category: ServiceCategory.DEEP_CLEAN,
    description:
      'Full home turnaround with upholstery, tile, and high-touch surface sanitation.',
    basePrice: 15000,
    isActive: true,
  },
  {
    name: 'Commercial General Cleaning',
    slug: 'commercial-general-cleaning',
    type: ServiceType.CLEANING,
    category: ServiceCategory.GENERAL_CLEANING,
    description:
      'Recurring office or retail cleaning with floor care and supplies restock.',
    basePrice: 25000,
    isActive: true,
  },
  {
    name: 'IT Support Visit',
    slug: 'it-support-visit',
    type: ServiceType.IT_SUPPORT,
    category: ServiceCategory.OTHER,
    description:
      'On-site IT troubleshooting, setup, and infrastructure reviews.',
    basePrice: 12000,
    isActive: true,
  },
]

async function main() {
  console.info(
    'Starting Prisma seed script for food catalog and service offerings...',
  )

  const categoryMap = new Map<string, { id: number; slug: string }>()

  for (const category of foodCategories) {
    const created = await prisma.foodCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description ?? null,
        imageUrl: category.imageUrl ?? null,
      },
      create: category,
    })
    categoryMap.set(created.slug, { id: created.id, slug: created.slug })
  }

  for (const item of foodItems) {
    const primaryCategory = categoryMap.get(item.categorySlug)
    if (!primaryCategory) {
      throw new Error(
        `Missing primary category slug "${item.categorySlug}" for item ${item.slug}`,
      )
    }

    const foodItemData = {
      name: item.name,
      description: item.description ?? null,
      ingredients: item.ingredients ?? null,
      nutritionInfo: item.nutritionInfo ?? null,
      price: item.price,
      sku: item.sku ?? null,
      stock: item.stock,
      isActive: item.isActive ?? true,
      categoryId: primaryCategory.id,
      mainImageUrl: item.mainImageUrl ?? null,
    }

    const savedItem = await prisma.foodItem.upsert({
      where: { slug: item.slug },
      update: foodItemData,
      create: {
        ...foodItemData,
        slug: item.slug,
      },
    })

    await prisma.foodItemCategory.deleteMany({
      where: { foodItemId: savedItem.id },
    })
    const extraCategorySlugs = item.additionalCategorySlugs ?? []
    const extraCategoryData = extraCategorySlugs
      .map((slug) => {
        if (slug === item.categorySlug) return null
        const target = categoryMap.get(slug)
        if (!target) {
          throw new Error(
            `Unknown additional category slug "${slug}" for item ${item.slug}`,
          )
        }
        return {
          foodItemId: savedItem.id,
          categoryId: target.id,
        }
      })
      .filter(Boolean) as { foodItemId: number; categoryId: number }[]

    if (extraCategoryData.length) {
      await prisma.foodItemCategory.createMany({
        data: extraCategoryData,
        skipDuplicates: true,
      })
    }

    await prisma.foodImage.deleteMany({ where: { foodItemId: savedItem.id } })
    const imageData = (item.imageUrls ?? []).map((url, index) => ({
      foodItemId: savedItem.id,
      url,
      position: index,
    }))

    if (imageData.length) {
      await prisma.foodImage.createMany({
        data: imageData,
        skipDuplicates: true,
      })
    }
  }

  for (const offering of serviceOfferings) {
    await prisma.serviceOffering.upsert({
      where: { slug: offering.slug },
      update: {
        name: offering.name,
        type: offering.type,
        category: offering.category ?? null,
        description: offering.description ?? null,
        basePrice: offering.basePrice ?? null,
        isActive: offering.isActive ?? true,
      },
      create: offering,
    })
  }

  console.info('Seeding complete.')
}

main()
  .catch((error) => {
    console.error('Seed script failed', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
