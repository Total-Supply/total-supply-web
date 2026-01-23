'use client'

import { useEffect, useState } from 'react'

import { LandingCTAEnhanced } from './landing-cta'
import { LandingFeaturedProducts } from './landing-featured-products'
import { LandingFeatures } from './landing-features'
import { LandingHero } from './landing-hero'
import { LandingServices } from './landing-services'
import { LandingStats } from './landing-stats'
import { LandingTestimonials } from './landing-testimonials'

type LandingStats = {
  totalOrders: number
  activeCustomers: number
  totalProducts: number
  servicesAvailable: number
}

export function LandingPage() {
  const [stats, setStats] = useState<LandingStats | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/public/stats')
        const data = await response.json()
        if (response.ok) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Failed to load stats', error)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen" suppressHydrationWarning>
      <LandingHero />
      <LandingStats stats={stats} />
      <LandingFeatures />
      <LandingServices />
      <LandingFeaturedProducts />
      <LandingTestimonials />
      <LandingCTAEnhanced />
    </div>
  )
}
