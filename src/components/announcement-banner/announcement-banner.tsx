import {
  Card,
  Container,
  Flex,
  HStack,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

import { FallInPlace } from '../motion/fall-in-place'
import { Button } from '../ui/button'

export interface AnnouncementBannerProps {
  title: string
  description: string
  href: string
  action?: string
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = (
  props,
) => {
  const { title, description, href, action } = props
  if (!title) {
    return null
  }

  return (
    <Flex position="absolute" zIndex="10" top="100px" width="100%">
      <Container maxW="container.2xl" px="8">
        <FallInPlace delay={1.4} translateY="-100px">
          <LinkBox maxW="400px" mx="auto">
            <Card.Root
              borderRadius="full"
              bg="white"
              px="4"
              py="2"
              boxShadow="sm"
              position="relative"
              _dark={{ bg: 'gray.900' }}
              _before={{
                content: `""`,
                position: 'absolute',
                zIndex: -1,
                inset: 0,
                borderRadius: 'inherit',
                margin: '-2px',
                bgGradient: 'linear(to-r, purple.500, cyan.500)',
              }}
              _hover={{ boxShadow: 'md' }}
            >
              <Card.Body py="2">
                <HStack justify="center">
                  <Text fontWeight="semibold" truncate>
                    <LinkOverlay as={NextLink} href={href}>
                      {title}
                    </LinkOverlay>
                  </Text>
                  <Text
                    display={{ base: 'none', md: 'block' }}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                  {action && (
                    <Button
                      size="xs"
                      variant="ghost"
                      color="muted"
                      _hover={{ textDecoration: 'none' }}
                    >
                      Read more
                      <Icon
                        as={FiArrowRight}
                        transform="translate(-5px)"
                        transitionProperty="common"
                        transitionDuration="normal"
                        ml="1"
                      />
                    </Button>
                  )}
                </HStack>
              </Card.Body>
            </Card.Root>
          </LinkBox>
        </FallInPlace>
      </Container>
    </Flex>
  )
}
