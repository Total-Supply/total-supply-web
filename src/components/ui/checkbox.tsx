import { Checkbox as ChakraCheckbox } from '@chakra-ui/react'

import * as React from 'react'

export interface CheckboxProps extends Omit<
  ChakraCheckbox.RootProps,
  'checked' | 'disabled' | 'onChange'
> {
  isChecked?: boolean
  checked?: boolean
  isDisabled?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const {
      isChecked,
      checked,
      isDisabled,
      disabled,
      onChange,
      children,
      ...rest
    } = props

    return (
      <ChakraCheckbox.Root
        checked={isChecked ?? checked}
        disabled={isDisabled ?? disabled}
        onCheckedChange={
          onChange
            ? (details) => {
                // Create a synthetic event for compatibility
                const syntheticEvent = {
                  target: {
                    name: props.name,
                    type: 'checkbox',
                    checked: details.checked,
                  },
                } as React.ChangeEvent<HTMLInputElement>
                onChange(syntheticEvent)
              }
            : undefined
        }
        {...rest}
      >
        <ChakraCheckbox.HiddenInput ref={ref} />
        <ChakraCheckbox.Control>
          <ChakraCheckbox.Indicator />
        </ChakraCheckbox.Control>
        {children && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
      </ChakraCheckbox.Root>
    )
  },
)
