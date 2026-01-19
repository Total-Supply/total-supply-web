import { defineSlotRecipe } from '@chakra-ui/react'

export const featureRecipe = defineSlotRecipe({
  slots: ['container', 'title', 'description', 'icon'],
  base: {
    container: {
      alignItems: 'flex-start',
      flexDirection: 'column',
      gap: '3',
    },
    title: {
      fontSize: 'lg',
      fontWeight: '600',
    },
    description: {
      fontSize: 'md',
      color: 'fg.muted',
      lineHeight: '1.6',
    },
    icon: {
      p: '2',
      borderRadius: 'lg',
      bg: 'primary.100',
      color: 'primary.700',
    },
  },
  variants: {
    variant: {
      default: {},
      'left-icon': {
        container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '4',
        },
        icon: {
          mt: '1',
        },
      },
      center: {
        container: {
          alignItems: 'center',
          textAlign: 'center',
        },
        title: {
          textAlign: 'center',
        },
        description: {
          textAlign: 'center',
        },
      },
      inline: {
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '3',
        },
        title: {
          display: 'inline-block',
          mr: '1',
          mb: '0',
        },
        description: {
          display: 'inline',
        },
      },
      light: {
        container: {
          bg: 'bg.muted',
          borderRadius: 'xl',
          p: '4',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
