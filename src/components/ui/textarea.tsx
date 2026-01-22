import {
  Textarea as ChakraTextarea,
  type TextareaProps,
} from '@chakra-ui/react'

import { forwardRef } from 'react'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    return (
      <ChakraTextarea
        ref={ref}
        {...props}
        className=" border border-border bg-background hover:bg-accent/50"
      />
    )
  },
)
