'use client'

import { useColorMode } from '@/src/hooks/color-mode'
import { IconButton } from '@chakra-ui/react'
import { FiMoon, FiSun } from 'react-icons/fi'

export const DashboardThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      variant="ghost"
      aria-label="theme toggle"
      onClick={toggleColorMode}
    >
      {colorMode === 'light' ? <FiMoon size={14} /> : <FiSun size={14} />}
    </IconButton>
  )
}
