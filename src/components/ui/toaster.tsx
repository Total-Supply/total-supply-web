'use client'

import {
  Toaster as ChakraToasterBase,
  type ToasterProps as ChakraToasterProps,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

import * as React from 'react'

/**
 * Chakra v3 has a typing bug:
 * - ToasterProps doesn't include:
 *   - children as a function (render prop)
 *   - toaster prop
 * So we safely extend it here.
 */
type CustomToasterProps = ChakraToasterProps & {
  toaster: ReturnType<typeof createToaster>
  children?: (toast: {
    id: string | number
    type?: string
    title?: React.ReactNode
    description?: React.ReactNode
    closable?: boolean
  }) => React.ReactElement
}

const ChakraToaster = ChakraToasterBase as React.FC<CustomToasterProps>

export const toaster = createToaster({
  placement: 'top-end',
  duration: 3000,
  pauseOnPageIdle: true,
})

export function AppToaster() {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id ?? String(toast.type ?? toast.title ?? 'toast')}
            width={{ md: 'sm' }}
            insetInline={{ mdDown: '4' }}
          >
            {toast.type === 'loading' ? (
              <Spinner size="sm" />
            ) : (
              <Toast.Indicator />
            )}

            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>

            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
