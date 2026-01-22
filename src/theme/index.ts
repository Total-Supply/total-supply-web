import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import '@fontsource-variable/inter'

import { fontSizes } from './foundations/typography'

// If you truly have recipe overrides, export them from src/theme/recipes.ts (optional).
// import { recipes, slotRecipes } from './recipes'

const toTokenScale = (scale: Record<string, string>) =>
  Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, { value: v }]))

const config = defineConfig({
  theme: {
    textStyles: {
      pageTitle: {
        fontSize: { base: '3xl', md: '4xl' },
        fontWeight: '700',
        letterSpacing: '-0.02em',
      },
      sectionTitle: {
        fontSize: { base: '2xl', md: '3xl' },
        fontWeight: '700',
        letterSpacing: '-0.01em',
      },
      eyebrow: {
        fontSize: 'xs',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'fg.muted',
      },
      body: {
        fontSize: 'md',
        lineHeight: '1.7',
      },
    },

    layerStyles: {
      card: {
        bg: 'bg.panel',
        borderWidth: '1px',
        borderColor: 'border.muted',
        borderRadius: '2xl',
        boxShadow: 'sm',
        transitionProperty: 'common',
        transitionDuration: 'fast',
        _hover: {
          boxShadow: 'md',
          borderColor: 'border.emphasized',
        },
      },
      panel: {
        bg: 'bg.panel',
        borderWidth: '1px',
        borderColor: 'border.muted',
        borderRadius: 'xl',
      },
    },

    tokens: {
      colors: {
        primary: toTokenScale({
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        }),
        secondary: toTokenScale({
          50: '#fce4ec',
          100: '#f8bbd0',
          200: '#f48fb1',
          300: '#f06292',
          400: '#ec407a',
          500: '#e91e63',
          600: '#d81b60',
          700: '#c2185b',
          800: '#ad1457',
          900: '#880e4f',
        }),
      },

      fonts: {
        heading: { value: 'Inter Variable, Inter, sans-serif' },
        body: { value: 'Inter Variable, Inter, sans-serif' },
      },

      fontSizes: toTokenScale(fontSizes),
    },

    semanticTokens: {
      colors: {
        background: { value: { base: '#ffffff', _dark: '#0f172a' } },
        card: { value: { base: '#ffffff', _dark: '#111827' } },
        muted: { value: { base: '#64748b', _dark: '#94a3b8' } },
        mutedForeground: { value: { base: '#94a3b8', _dark: '#cbd5f5' } },
        border: { value: { base: '#e2e8f0', _dark: '#1f2937' } },
        accent: { value: { base: '#e2e8f0', _dark: '#1f2937' } },
      },
    },

    // ✅ Chakra v3 uses these keys (ONLY if you have overrides)
    // recipes,
    // slotRecipes,
  },
})

export const system = createSystem(defaultConfig, config)
