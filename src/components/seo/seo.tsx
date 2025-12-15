import siteConfig from '@/src/data/config'
import { Metadata } from 'next'

import React from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
}

export const SEO = ({ title, description, keywords, ogImage }: SEOProps) => {
  const seoTitle = title
    ? `${title} | ${siteConfig.seo.openGraph?.siteName || siteConfig.seo.title}`
    : siteConfig.seo.openGraph?.siteName || siteConfig.seo.title

  const seoDescription =
    description ||
    siteConfig.seo.openGraph?.description ||
    siteConfig.seo.description

  return null // SEO is handled via metadata in Next.js 13+
}

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage,
}: SEOProps): Metadata {
  const seoTitle = title
    ? `${title} | ${siteConfig.seo.openGraph?.siteName || siteConfig.seo.title}`
    : siteConfig.seo.openGraph?.siteName || siteConfig.seo.title

  const seoDescription =
    description ||
    siteConfig.seo.openGraph?.description ||
    siteConfig.seo.description

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : [],
      siteName: siteConfig.seo.openGraph?.siteName,
      type: siteConfig.seo.openGraph?.type as any,
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.seo.twitter?.site,
      creator: siteConfig.seo.twitter?.creator,
    },
  }
}
