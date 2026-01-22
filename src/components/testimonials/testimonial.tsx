import { Avatar, Card, Heading, Link, Stack, Text } from '@chakra-ui/react'
import { FaTwitter } from 'react-icons/fa'

import type { ComponentProps } from 'react'

export interface TestimonialProps extends ComponentProps<typeof Card.Root> {
  name: string
  description: React.ReactNode
  avatar: string
  href?: string
  children?: React.ReactNode
}

export const Testimonial = ({
  name,
  description,
  avatar,
  href,
  children,
  ...rest
}: TestimonialProps) => {
  return (
    <Card.Root position="relative" {...rest}>
      <Card.Header display="flex" flexDirection="row" alignItems="center">
        <Avatar.Root size="sm">
          <Avatar.Fallback name={name} />
          <Avatar.Image src={avatar} alt={name} />
        </Avatar.Root>
        <Stack gap="1" ms="4">
          <Heading size="sm">{name}</Heading>
          <Text color="muted" fontSize="xs">
            {description}
          </Text>
        </Stack>
      </Card.Header>
      <Card.Body>
        {children}

        {href && (
          <Link href={href} position="absolute" top="4" right="4">
            <FaTwitter />
          </Link>
        )}
      </Card.Body>
    </Card.Root>
  )
}
