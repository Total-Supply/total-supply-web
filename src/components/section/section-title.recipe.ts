import { defineRecipe } from '@chakra-ui/react'

export const sectionTitleRecipe = defineRecipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4',
  },

  variants: {
    align: {
      left: {
        alignItems: 'flex-start',
        textAlign: 'left',
      },
      center: {
        alignItems: 'center',
        textAlign: 'center',
      },
    },

    variant: {
      default: {},
      subtle: {},
    },
  },

  defaultVariants: {
    align: 'center',
    variant: 'default',
  },
})
