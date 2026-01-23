'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Quote, Star } from 'lucide-react'

import { useEffect, useState } from 'react'

const testimonials = [
  {
    name: 'Priya Jayawardena',
    role: 'Business Owner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    content:
      'Total Supply has transformed how we manage our office supplies. Fast delivery and excellent quality!',
    rating: 5,
  },
  {
    name: 'Nuwan Fernando',
    role: 'Restaurant Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nuwan',
    content:
      'Fresh ingredients delivered daily. Their food supply service is reliable and professional.',
    rating: 5,
  },
  {
    name: 'Samantha Silva',
    role: 'Homemaker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha',
    content:
      'The cleaning service is outstanding! My home has never looked better. Highly recommended!',
    rating: 5,
  },
]

export function LandingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-muted/20 py-20 sm:py-28 px-8 sm:px-10 lg:px-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied customers across Sri Lanka
            </p>
          </MotionBox>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-full rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-8 shadow-lg">
                <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />

                <div className="relative space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <p className="text-lg leading-relaxed">
                    {testimonial.content}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </MotionBox>
          ))}
        </div>
      </div>
    </div>
  )
}
