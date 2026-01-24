'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/hooks/use-toast'
import { Textarea } from '@chakra-ui/react'
import {
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User,
} from 'lucide-react'

import { useState } from 'react'

export function ContactPage() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send message')
      }

      toast({
        title: 'Message sent successfully! 🎉',
        description: "We'll get back to you within 24 hours",
        status: 'success',
        duration: 4000,
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description:
          error instanceof Error ? error.message : 'Please try again later',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'support@totalsupply.lk',
      link: 'mailto:support@totalsupply.lk',
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+94 11 000 0000',
      link: 'tel:+94110000000',
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '123 Business Street, Colombo 00700, Sri Lanka',
      link: 'https://maps.google.com',
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Monday - Saturday: 8:00 AM - 8:00 PM',
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-background border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative py-16 sm:py-20 lg:py-24">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 sm:mb-4">
              Get in Touch
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground">
              Have a question or feedback? We&#39;d love to hear from you
            </p>
          </MotionBox>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Contact Form */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Send us a Message
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below and we&#39;ll get back to you as soon
                  as possible
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Subject <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length}/1000 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  colorPalette="primary"
                  loading={isSubmitting}
                  className="w-full sm:w-auto min-w-[200px]"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </MotionBox>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon

              return (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ${info.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={
                              info.link.startsWith('http') ? '_blank' : '_self'
                            }
                            rel={
                              info.link.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className="text-sm text-muted-foreground hover:text-primary transition-colors break-words"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground break-words">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </MotionBox>
              )
            })}

            {/* Map Placeholder */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm overflow-hidden">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MapPin className="h-8 w-8" />
                    <span className="text-sm font-medium">View on Map</span>
                  </a>
                </div>
              </div>
            </MotionBox>
          </div>
        </div>
      </div>
    </div>
  )
}
