'use client'

import Image from 'next/image'

import { useState } from 'react'

type LogoImageProps = {
  size?: number
  className?: string
  priority?: boolean
}

export function LogoImage({
  size = 40,
  className = '',
  priority = false,
}: LogoImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    // Fallback to text logo
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-lg font-bold text-primary">TS</span>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl ring-2 ring-primary/20 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/logo/logo.png"
        alt="Total Supply Logo"
        width={size}
        height={size}
        sizes={`${size}px`}
        className="object-cover"
        priority={priority}
        quality={75}
        onError={() => setImageError(true)}
      />
    </div>
  )
}

