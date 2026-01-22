'use client'

import { useColorMode } from '@/src/hooks/color-mode'
import { IconButton } from '@chakra-ui/react'
import { FiMoon, FiSun } from 'react-icons/fi'

export const DashboardThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      size="sm"
      variant="ghost"
      aria-label="theme toggle"
      title="Toggle theme"
      onClick={toggleColorMode}
      className="group"
      _hover={{ bg: 'blackAlpha.100' }}
      _active={{ transform: 'scale(0.96)' }}
    >
      {colorMode === 'light' ? (
        <FiMoon
          className="transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110"
          size={14}
        />
      ) : (
        <FiSun
          className="transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110"
          size={14}
        />
      )}
    </IconButton>
  )
}
