import { ContactPage } from '@/src/components/contact/contact-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Total Supply',
  description:
    "Get in touch with Total Supply. We're here to help with any questions or concerns.",
}

export default function Contact() {
  return <ContactPage />
}
