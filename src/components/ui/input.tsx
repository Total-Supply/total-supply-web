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
    const { isDisabled, disabled, ...rest } = props
    return <ChakraInput ref={ref} disabled={isDisabled ?? disabled} {...rest} />
  },
)
