'use client'

import { SimpleGrid } from '@chakra-ui/react'

import * as React from 'react'

import {
  Section,
  type SectionProps,
  SectionTitle,
  type SectionTitleProps,
} from '../section'

type ResponsiveNumber =
  | number
  | Array<number | null>
  | {
      base?: number
      sm?: number
      md?: number
      lg?: number
      xl?: number
      '2xl'?: number
    }

export interface TestimonialsProps
  extends
    Omit<SectionProps, 'title'>,
    Pick<SectionTitleProps, 'title' | 'description'> {
  columns?: ResponsiveNumber
}

export const Testimonials: React.FC<TestimonialsProps> = (props) => {
  const {
    children,
    title,
    description,
    columns = [1, null, 2],
    ...rest
  } = props

  return (
    <Section {...rest}>
      <SectionTitle title={title} description={description} />
      <SimpleGrid columns={columns} gap="8">
        {children}
      </SimpleGrid>
    </Section>
  )
}
