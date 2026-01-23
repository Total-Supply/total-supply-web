'use client'

import { MotionBox } from '@/src/components/motion/box'
import siteConfig from '@/src/data/config'
import { Container } from '@chakra-ui/react'
import {
  CreditCard,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Package,
  Phone,
  Shield,
  Truck,
  Twitter,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Track Order', href: '/orders' },
      { label: 'Returns', href: '/returns' },
      { label: 'Shipping Info', href: '/shipping' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  const features = [
    { icon: Package, label: 'Quality Products' },
    { icon: Truck, label: 'Fast Delivery' },
    { icon: Shield, label: 'Secure Payment' },
    { icon: CreditCard, label: 'Easy Returns' },
  ]

  return (
    <footer className="relative bg-gradient-to-b from-muted/20 to-muted/40 border-t border-border/60">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <Container maxW="container.2xl" className="relative px-4 md:px-8">
        {/* Features Bar */}
        <div className="py-8 border-b border-border/60">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {features.map((feature, index) => (
              <MotionBox
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-card/90 to-card/60 border border-border/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-semibold">{feature.label}</span>
              </MotionBox>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Total Supply Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Total Supply
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Fresh & Fast Delivery
                  </p>
                </div>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {siteConfig.seo.description ||
                  'Your trusted partner for quality products and exceptional service.'}
              </p>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <a
                    href="mailto:info@totalsupply.lk"
                    className="hover:text-primary transition-colors"
                  >
                    info@totalsupply.lk
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <a
                    href="tel:+94771234567"
                    className="hover:text-primary transition-colors"
                  >
                    +94 77 123 4567
                  </a>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>123 Main Street, Colombo 10400, Sri Lanka</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50 text-muted-foreground transition-all duration-200 hover:from-primary/20 hover:to-primary/10 hover:text-primary hover:scale-110"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/60 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {siteConfig.footer.copyright ||
                `© ${currentYear} Total Supply. All rights reserved.`}
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">We accept:</span>
              <div className="flex items-center gap-2">
                {['visa', 'mastercard', 'amex'].map((method) => (
                  <div
                    key={method}
                    className="h-6 px-3 rounded border border-border/60 bg-card flex items-center justify-center text-[10px] font-semibold uppercase text-muted-foreground"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
