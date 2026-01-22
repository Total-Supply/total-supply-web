'use client'

import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'

import type { ReactNode } from 'react'

export type MotionBoxProps = HTMLMotionProps<'div'> & {
  children?: ReactNode
}

export const MotionBox = motion.div
