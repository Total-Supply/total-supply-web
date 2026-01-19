import siteConfig from '@/src/data/config'
import {
  Box,
  BoxProps,
  Container,
  Flex,
  HStack,
  Link,
  LinkProps,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'

export interface FooterProps extends BoxProps {
  columns?: number
}

export const Footer: React.FC<FooterProps> = (props) => {
  const { columns = 2, ...rest } = props
  return (
    <Box bg="bg.panel" {...rest}>
      <Container
        maxW="container.2xl"
        px={{ base: 4, md: 8 }}
        py={{ base: 10, md: 12 }}
      >
        <SimpleGrid columns={{ base: 1, md: columns }} gap={{ base: 8, md: 12 }}>
          <Stack gap={{ base: 6, md: 8 }}>
            <Stack alignItems="flex-start">
              <Flex>
                <Box as={siteConfig.logo} flex="1" height="32px" />
              </Flex>
              <Text fontSize="md" color="fg.muted">
                {siteConfig.seo.description}
              </Text>
            </Stack>
            <Copyright>{siteConfig.footer.copyright}</Copyright>
          </Stack>
          <HStack
            justify={{ base: 'flex-start', md: 'flex-end' }}
            gap="4"
            alignSelf={{ base: 'flex-start', md: 'flex-end' }}
          >
            {siteConfig.footer?.links?.map(({ href, label }) => (
              <FooterLink key={href} href={href}>
                {label}
              </FooterLink>
            ))}
          </HStack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export interface CopyrightProps {
  title?: React.ReactNode
  children: React.ReactNode
}

export const Copyright: React.FC<CopyrightProps> = ({
  title,
  children,
}: CopyrightProps) => {
  let content
  if (title && !children) {
    content = `&copy; ${new Date().getFullYear()} - ${title}`
  }
  return (
    <Text color="fg.muted" fontSize="sm">
      {content || children}
    </Text>
  )
}

export const FooterLink: React.FC<LinkProps> = (props) => {
  const { children, ...rest } = props
  return (
    <Link
      color="fg.muted"
      fontSize="sm"
      textDecoration="none"
      transitionProperty="color"
      transitionDuration="fast"
      _hover={{
        color: 'fg',
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
