import { Box, Card, Flex, Stack, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

type AdminTableShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function AdminTableShell({
  title,
  description,
  actions,
  children,
  className,
}: AdminTableShellProps) {
  return (
    <Card.Root
      className={className}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="border.muted"
      bg="bg.panel"
      boxShadow="md"
    >
      <Card.Header>
        <Flex flexWrap="wrap" align="flex-start" justify="space-between" gap={4}>
          <Box>
            <Text fontSize="xl" fontWeight="semibold">
              {title}
            </Text>
            {description ? (
              <Text mt={1} fontSize="sm" color="fg.muted">
                {description}
              </Text>
            ) : null}
          </Box>
          {actions ? (
            <Flex flexWrap="wrap" gap={2}>
              {actions}
            </Flex>
          ) : null}
        </Flex>
      </Card.Header>
      <Card.Body>
        <Stack gap={4}>{children}</Stack>
      </Card.Body>
    </Card.Root>
  )
}

type AdminTableProps = {
  children: ReactNode
  className?: string
}

export function AdminTable({ children, className }: AdminTableProps) {
  return (
    <Box
      className={className}
      overflowX="auto"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border.muted"
      bg="bg.panel"
    >
      <Box as="table" width="full" minW="720px" textAlign="left" fontSize="sm">
        {children}
      </Box>
    </Box>
  )
}



