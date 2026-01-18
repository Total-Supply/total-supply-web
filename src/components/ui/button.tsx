import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react'

import { forwardRef } from 'react'

export interface ButtonProps extends Omit<
  ChakraButtonProps,
  'disabled' | 'loading'
> {
  isDisabled?: boolean
  disabled?: boolean
  isLoading?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { isDisabled, disabled, isLoading, loading, ...rest } = props
    return (
      <ChakraButton
        ref={ref}
        disabled={isDisabled ?? disabled}
        loading={isLoading ?? loading}
        {...rest}
      />
    )
  },
)
