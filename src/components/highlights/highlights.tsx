import { Box, Card, Grid, GridItem, GridItemProps, Heading } from '@chakra-ui/react'
import type { ComponentProps } from 'react'

import { Section, SectionProps } from '../section'
import { Testimonial, TestimonialProps } from '../testimonials'

export interface HighlightBoxProps
  extends GridItemProps, Omit<ComponentProps<typeof Card.Root>, 'title'> {}

export const HighlightsItem: React.FC<HighlightBoxProps> = (props) => {
  const { children, title, ...rest } = props
  return (
    <Card.Root
      as={GridItem}
      borderRadius="md"
      p="8"
      flex="1 0"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap="8"
      overflow="hidden"
      position="relative"
      bg="white"
      _dark={{ bg: 'gray.800' }}
      {...rest}
    >
      <Card.Body>
        {title && (
          <Heading fontSize="3xl" mb="8">
            {title}
          </Heading>
        )}
        {children}
      </Card.Body>
    </Card.Root>
  )
}

export const HighlightsTestimonialItem: React.FC<
  HighlightBoxProps & TestimonialProps & { gradient: [string, string] }
> = (props) => {
  const {
    name,
    description,
    avatar,
    children,
    gradient = ['primary.500', 'secondary.500'],
    ...rest
  } = props
  return (
    <HighlightsItem
      justifyContent="center"
      _dark={{ borderColor: 'whiteAlpha.300' }}
      p="4"
      {...rest}
    >
      <Box
        bgGradient={`linear(to-br, ${gradient[0]}, ${gradient[1]})`}
        opacity="0.2"
        position="absolute"
        inset="0px"
        pointerEvents="none"
        zIndex="0"
        _dark={{ opacity: 0.5, filter: 'blur(50px)' }}
      />
      <Testimonial
        name={name}
        description={
          <Box as="span" color="whiteAlpha.700">
            {description}
          </Box>
        }
        avatar={avatar}
        border="0"
        bg="transparent"
        boxShadow="none"
        color="white"
        position="relative"
      >
        {children}
      </Testimonial>
    </HighlightsItem>
  )
}

export const Highlights: React.FC<SectionProps> = (props) => {
  const { children, ...rest } = props

  return (
    <Section
      innerWidth="container.xl"
      position="relative"
      overflow="hidden"
      {...rest}
    >
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={8}
        position="relative"
      >
        {children}
      </Grid>
    </Section>
  )
}


