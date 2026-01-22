'use client'

import {
  Box,
  Circle,
  Heading,
  Icon,
  type RecipeVariantProps,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useSlotRecipe,
} from '@chakra-ui/react'

import * as React from 'react'

import { Section, SectionTitle, type SectionTitleProps } from '../section'
import { featureRecipe } from './feature.recipe'

interface RevealerProps {
  children: React.ReactNode
  delay?: number
}

const Revealer = ({ children }: RevealerProps) => {
  return children
}

export interface FeaturesProps extends Omit<
  SectionTitleProps,
  'title' | 'variant'
> {
  title?: React.ReactNode
  description?: React.ReactNode
  features: Array<FeatureProps>
  columns?: number | number[] // ✅ v3-safe
  spacing?: string | number
  aside?: React.ReactNode
  reveal?: React.FC<RevealerProps>
  iconSize?: string | number // ✅ v3-safe
  innerWidth?: string | number // ✅ v3-safe (if Section supports it)
}

export interface FeatureProps {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ComponentType
  iconPosition?: 'left' | 'top'
  iconSize?: string | number
  ip?: 'left' | 'top'
  delay?: number
}

type FeatureVariants = RecipeVariantProps<typeof featureRecipe>

export const Feature: React.FC<FeatureProps & FeatureVariants> = (props) => {
  const {
    title,
    description,
    icon,
    iconPosition,
    iconSize = 8,
    ip,
    ...rest
  } = props

  const recipe = useSlotRecipe({ recipe: featureRecipe })
  const [variantProps] = recipe.splitVariantProps(rest)
  const styles = recipe(variantProps)

  const pos = iconPosition || ip
  const direction = pos === 'left' ? 'row' : 'column'

  return (
    <Stack css={styles.container} direction={direction}>
      {icon && (
        <Circle css={styles.icon}>
          <Icon as={icon} boxSize={iconSize} />
        </Circle>
      )}
      <Box>
        <Heading css={styles.title}>{title}</Heading>
        <Text css={styles.description}>{description}</Text>
      </Box>
    </Stack>
  )
}

export const Features: React.FC<FeaturesProps> = (props) => {
  const {
    title,
    description,
    features,
    columns = [1, 2, 3],
    spacing = 8,
    align: alignProp = 'center',
    iconSize = 8,
    aside,
    reveal: Wrap = Revealer,
    ...rest
  } = props

  const align = aside ? 'left' : alignProp
  const ip = align === 'left' ? 'left' : 'top'

  return (
    <Section
      {...{
        ...rest,
        ...(rest.innerWidth !== undefined
          ? {
              innerWidth:
                typeof rest.innerWidth === 'number'
                  ? String(rest.innerWidth)
                  : rest.innerWidth,
            }
          : {}),
      }}
    >
      <Stack direction="row" height="full" align="flex-start">
        <VStack flex="1" gap={[4, null, 8]} alignItems="stretch">
          {(title || description) && (
            <Wrap>
              <SectionTitle
                title={title}
                description={description}
                align={align}
              />
            </Wrap>
          )}

          <SimpleGrid columns={columns as number | number[]} gap={spacing}>
            {features.map((feature, i) => (
              <Wrap key={i} delay={feature.delay}>
                <Feature iconSize={iconSize} {...feature} ip={ip} />
              </Wrap>
            ))}
          </SimpleGrid>
        </VStack>

        {aside && (
          <Box flex="1" p="8">
            {aside}
          </Box>
        )}
      </Stack>
    </Section>
  )
}
