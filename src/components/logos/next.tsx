'use client'

import { useColorModeValue } from '@/src/hooks/color-mode'

import * as React from 'react'

export const NextjsLogo = (props: React.SVGProps<SVGSVGElement>) => {
  const fg = useColorModeValue('black', 'white')

  return (
    <svg viewBox="0 0 148 90" {...props}>
      <path
        d="M34.992 23.495h27.855v2.219H37.546v16.699h23.792v2.219H37.546v18.334h25.591v2.219H34.992v-41.69zm30.35 0h2.96l13.115 18.334 13.405-18.334L113.055.207 83.1 43.756l15.436 21.429H95.46L81.417 45.683 67.316 65.185h-3.018L79.85 43.756 65.343 23.495zm34.297 2.219v-2.219h31.742v2.219h-14.623v39.47h-2.554v-39.47H99.64zM.145 23.495h3.192l44.011 66.003L29.16 65.185 2.814 26.648l-.116 38.537H.145v-41.69z"
        fill={fg}
        fillRule="nonzero"
      />
    </svg>
  )
}
