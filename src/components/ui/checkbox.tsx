'use client'

import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'

import { forwardRef } from 'react'

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { checked, onCheckedChange, disabled, className, children, ...rest } =
      props

    return (
      <ChakraCheckbox.Root
        checked={checked}
        onCheckedChange={(details) =>
          onCheckedChange?.(Boolean(details.checked))
        }
        disabled={disabled}
        className={className}
        {...rest}
      >
        <ChakraCheckbox.HiddenInput ref={ref} />
        <ChakraCheckbox.Control className="transition-all duration-200 hover:scale-110">
          <ChakraCheckbox.Indicator />
        </ChakraCheckbox.Control>
        {children && (
          <ChakraCheckbox.Label className="ml-2">
            {children}
          </ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    )
  },
)
