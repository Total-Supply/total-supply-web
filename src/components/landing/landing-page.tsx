'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { LandingHero } from './landing-hero'
import { LandingStats } from './landing-stats'
import { LandingFeatures } from './landing-features'
import { LandingServices } from './landing-services'

// Lazy load below-the-fold sections for better initial load performance
const LandingFeaturedProducts = dynamic(
  () => import('./landing-featured-products').then((mod) => mod.LandingFeaturedProducts),
  { ssr: true }
)
const LandingTestimonials = dynamic(
  () => import('./landing-testimonials').then((mod) => mod.LandingTestimonials),
  { ssr: true }
)
const LandingCTAEnhanced = dynamic(
  () => import('./landing-cta').then((mod) => mod.LandingCTAEnhanced),
  { ssr: true }
)

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
