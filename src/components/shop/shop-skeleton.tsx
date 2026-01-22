'use client'

import { SimpleGrid, Skeleton, Stack } from '@chakra-ui/react'

type ShopSkeletonProps = {
  count?: number
}

export function ShopSkeleton({ count = 12 }: ShopSkeletonProps) {
  return (
    <SimpleGrid columns={{ base: 2, md: 4, xl: 6 }} gap={{ base: 4, md: 6 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Stack
          key={index}
          borderRadius="2xl"
          overflow="hidden"
          bg="whiteAlpha.900"
          boxShadow="lg"
        >
          <Skeleton height={{ base: '140px', md: '160px' }} />
          <Stack gap={2} p={4}>
            <Skeleton height="14px" />
            <Skeleton height="12px" />
          </Stack>
        </Stack>
      ))}
    </SimpleGrid>
  )
}



