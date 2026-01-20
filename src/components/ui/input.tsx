import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'

import { forwardRef } from 'react'

export interface InputProps extends Omit<ChakraInputProps, 'disabled'> {
  isDisabled?: boolean
  disabled?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const { isDisabled, disabled, className, ...rest } = props
    return (
      <ChakraInput
        ref={ref}
        disabled={isDisabled ?? disabled}
        className={`h-8 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 hover:border-ring focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
        {...rest}
      />
    )
  },
)
