import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react'

import { type ReactNode, forwardRef } from 'react'

export interface ButtonProps extends Omit<
  ChakraButtonProps,
  'disabled' | 'loading'
> {
  isDisabled?: boolean
  disabled?: boolean
  isLoading?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle' | 'surface' | 'plain'
  colorPalette?:
    | 'teal'
    | 'blue'
    | 'orange'
    | 'red'
    | 'gray'
    | 'green'
    | 'primary'
}

const getColorClasses = (colorPalette?: string, variant?: string) => {
  const palette = colorPalette || 'primary'

  if (variant === 'outline') {
    const outlineColors = {
      primary:
        'border border-primary text-primary bg-transparent hover:bg-primary/10',
      teal: 'border border-chart-2 text-chart-2 bg-transparent hover:bg-chart-2/10',
      blue: 'border border-chart-1 text-chart-1 bg-transparent hover:bg-chart-1/10',
      orange:
        'border border-chart-5 text-chart-5 bg-transparent hover:bg-chart-5/10',
      red: 'border border-destructive text-destructive bg-transparent hover:bg-destructive/10',
      gray: 'border border-border text-muted-foreground bg-transparent hover:bg-muted',
      green:
        'border border-chart-3 text-chart-3 bg-transparent hover:bg-chart-3/10',
    }
    return outlineColors[palette as keyof typeof outlineColors]
  }

  if (variant === 'ghost') {
    const ghostColors = {
      primary: 'text-primary bg-transparent hover:bg-primary/10 border-none',
      teal: 'text-chart-2 bg-transparent hover:bg-chart-2/10 border-none',
      blue: 'text-chart-1 bg-transparent hover:bg-chart-1/10 border-none',
      orange: 'text-chart-5 bg-transparent hover:bg-chart-5/10 border-none',
      red: 'text-destructive bg-transparent hover:bg-destructive/10 border-none',
      gray: 'text-muted-foreground bg-transparent hover:bg-muted border-none',
      green: 'text-chart-3 bg-transparent hover:bg-chart-3/10 border-none',
    }
    return ghostColors[palette as keyof typeof ghostColors]
  }

  // Solid variant (full background for CTAs)
  if (variant === 'solid') {
    const solidColors = {
      primary:
        'bg-primary text-primary-foreground hover:bg-primary/90 border-none',
      teal: 'bg-chart-2 text-white hover:bg-chart-2/90 border-none',
      blue: 'bg-chart-1 text-white hover:bg-chart-1/90 border-none',
      orange: 'bg-chart-5 text-white hover:bg-chart-5/90 border-none',
      red: 'bg-destructive text-white hover:bg-destructive/90 border-none',
      gray: 'bg-muted text-muted-foreground hover:bg-muted/80 border-none',
      green: 'bg-chart-3 text-white hover:bg-chart-3/90 border-none',
    }
    return solidColors[palette as keyof typeof solidColors]
  }

  // Default outline style
  return 'border border-border text-foreground bg-transparent hover:bg-accent'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      isDisabled,
      disabled,
      isLoading,
      loading,
      className,
      variant = 'outline',
      colorPalette,
      ...rest
    } = props

    const colorClasses = getColorClasses(colorPalette, variant)

    return (
      <ChakraButton
        ref={ref}
        disabled={isDisabled ?? disabled}
        loading={isLoading ?? loading}
        className={`h-8 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${colorClasses} ${className || ''}`}
        {...rest}
      />
    )
  },
)
