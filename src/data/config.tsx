import { Button, Link } from '@chakra-ui/react'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'

import { Logo } from './logo'

interface SEOConfig {
  title: string
  description: string
  titleTemplate?: string
  openGraph?: {
    type: string
    locale: string
    url: string
    siteName: string
    description: string
  }
  twitter?: {
    handle: string
    site: string
    cardType: string
    creator: string
  }
}

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'Total Supply',
    description: 'The complete supply management solution',
    titleTemplate: '%s | Total Supply',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://totalsupply.com',
      siteName: 'Total Supply',
      description: 'The complete supply management solution',
    },
    twitter: {
      handle: '@totalsupply',
      site: '@totalsupply',
      cardType: 'summary_large_image',
      creator: '@totalsupply',
    },
  } as SEOConfig,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'features',
        label: 'Features',
      },
      {
        id: 'pricing',
        label: 'Pricing',
      },
      {
        id: 'faq',
        label: 'FAQ',
      },
      {
        label: 'Login',
        href: '/login',
      },
      {
        label: 'Sign Up',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        Built by{' '}
        <Link href="https://twitter.com/Pagebakers">Eelco Wiersma</Link>
      </>
    ),
    links: [
      {
        href: 'mailto:hello@saas-ui.dev',
        label: 'Contact',
      },
      {
        href: 'https://twitter.com/saas_js',
        label: <FaTwitter size="14" />,
      },
      {
        href: 'https://github.com/saas-js/saas-ui',
        label: <FaGithub size="14" />,
      },
    ],
  },
  signup: {
    title: 'Join Total Supply',
    features: [
      {
        icon: FiCheck,
        title: 'Reliable',
        description: 'Consistent ordering, delivery, and service workflows.',
      },
      {
        icon: FiCheck,
        title: 'Scalable',
        description: 'Built to grow with your store and service volume.',
      },
      {
        icon: FiCheck,
        title: 'Transparent',
        description:
          'Track orders and service requests with real-time status updates.',
      },
      {
        icon: FiCheck,
        title: 'Secure',
        description: 'Verified accounts with admin approvals and audit logs.',
      },
    ],
  },
}

export default siteConfig
