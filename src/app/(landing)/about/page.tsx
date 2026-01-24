import { AboutPage } from '@/src/components/about/about-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Total Supply',
  description:
    'Learn more about Total Supply - your trusted partner for quality products and professional services across Sri Lanka.',
}

export default function About() {
  return <AboutPage />
}
