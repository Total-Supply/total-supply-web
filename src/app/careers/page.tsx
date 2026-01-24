import { CareersPage } from '@/src/components/careers/careers-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers | Total Supply',
  description:
    'Join our team at Total Supply. Explore exciting career opportunities and grow with us.',
}

export default function Careers() {
  return <CareersPage />
}
