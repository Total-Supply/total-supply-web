'use client'

import {
  IconButtonProps as ChakraIconButtonProps,
  IconButton,
} from '@chakra-ui/react'
import { LucideIcon } from 'lucide-react'

import { forwardRef } from 'react'

type ActionVariant = 'view' | 'edit' | 'delete' | 'add' | 'refresh' | 'cancel'

interface IconActionButtonProps extends Omit<
  ChakraIconButtonProps,
  'aria-label' | 'variant'
> {
  icon: LucideIcon
  label: string
  variant?: ActionVariant
  isLoading?: boolean
}

const getVariantClasses = (variant?: ActionVariant) => {
  const variants: Record<ActionVariant, string> = {
    view: 'text-chart-1 hover:text-chart-1/70',
    edit: 'text-amber-400 hover:text-amber-300',
    delete: 'text-destructive hover:text-destructive/70',
    add: 'text-chart-2 hover:text-chart-2/70',
    refresh: 'text-muted-foreground hover:text-foreground',
    cancel: 'text-muted-foreground hover:text-foreground',
  }
  return variants[variant || 'view']
}

export const IconActionButton = forwardRef<
  HTMLButtonElement,
  IconActionButtonProps
>(function IconActionButton(
  {
    icon: Icon,
    label,
    variant = 'view',
    isLoading = false,
    className,
    ...props
  },
  ref,
) {
  const variantClasses = getVariantClasses(variant)

  return (
    <IconButton
      ref={ref}
      aria-label={label}
      size="sm"
      variant="ghost"
      disabled={isLoading}
      className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 ${
        !isLoading ? 'hover:scale-110 hover:-translate-y-0.5' : ''
      } active:scale-95 bg-transparent hover:bg-transparent ${variantClasses} ${className || ''}`}
      {...props}
    >
      <Icon
        className={`h-4 w-4 ${
          isLoading && variant === 'refresh' ? 'animate-spin' : ''
        }`}
      />
    </IconButton>
  )
})
