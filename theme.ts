import { createSystem, defaultConfig, defineSlotRecipe } from '@chakra-ui/react'

const sectionTitleRecipe = defineSlotRecipe({
  slots: ['wrapper', 'title', 'description'],
  base: {
    wrapper: {
      gap: 4,
    },
    title: {
      fontSize: '3xl',
      fontWeight: 'bold',
    },
    description: {
      fontSize: 'lg',
      color: 'fg.muted',
    },
  },
  variants: {
    size: {
      default: {
        title: { fontSize: '3xl' },
        description: { fontSize: 'lg' },
      },
      large: {
        title: { fontSize: '5xl' },
        description: { fontSize: 'xl' },
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export const system = createSystem(defaultConfig, {
  theme: {
    slotRecipes: {
      sectionTitle: sectionTitleRecipe,
    },
  },
})
