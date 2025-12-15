import siteConfig from '@/src/data/config'
import { NextSeo, NextSeoProps } from 'next-seo'

import React from 'react'

export const SEO = ({ title, description, ...props }: NextSeoProps) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{ ...siteConfig.seo.openGraph, title, description }}
    titleTemplate={siteConfig.seo.titleTemplate}
    twitter={siteConfig.seo.twitter}
    {...props}
  />
)
