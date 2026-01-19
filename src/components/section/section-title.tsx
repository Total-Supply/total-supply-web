'use client'

import {
  Box,
  Heading,
  type RecipeVariantProps,
  type StackProps,
  VStack,
  useRecipe,
} from '@chakra-ui/react'

import * as React from 'react'

import { sectionTitleRecipe } from './section-title.recipe'

type SectionTitleVariants = RecipeVariantProps<typeof sectionTitleRecipe>

export interface SectionTitleProps
  extends Omit<StackProps, 'title' | 'align'>, SectionTitleVariants {
  title: React.ReactNode
  description?: React.ReactNode
}

export const SectionTitle: React.FC<SectionTitleProps> = (props) => {
  const recipe = useRecipe({ recipe: sectionTitleRecipe })
  const [variantProps, rest] = recipe.splitVariantProps(props)
  const styles = recipe(variantProps)

  const { title, description, ...restProps } = rest

  return (
    <VStack css={styles} gap={4} {...restProps}>
      <Heading as="h2" textStyle="sectionTitle">
        {title}
      </Heading>

      {description && (
        <Box textStyle="body" color="fg.muted">
          {description}
        </Box>
      )}
    </VStack>
  )
}
