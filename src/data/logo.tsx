import { HTMLChakraProps, chakra } from '@chakra-ui/react'

export const Logo: React.FC<HTMLChakraProps<'img'>> = (props) => {
  return (
    <chakra.img
      src="/images/logo/logo.png"
      alt=""
      aria-hidden="true"
      {...props}
    />
  )
}
