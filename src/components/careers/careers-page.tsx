'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import {
  Briefcase,
  Clock,
  Globe,
  Heart,
  MapPin,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CareersPage() {
  const router = useRouter()

  const benefits = [
    {
      icon: Heart,
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for you and your family',
      color: 'from-pink-500/20 to-pink-600/10 text-pink-400 ring-pink-500/30',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Continuous learning and development opportunities',
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Work-life balance with flexible working arrangements',
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Collaborative culture with talented colleagues',
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    },
  ]

  const openings = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Colombo',
      type: 'Full-time',
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Colombo',
      type: 'Full-time',
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Colombo',
      type: 'Full-time',
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
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
                <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 sm:mb-4">
              Join Our Team
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground">
              Build the future of supply chain and services with us
            </p>
          </MotionBox>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-20 lg:space-y-24">
        {/* Benefits Section */}
        <section>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Why Work With Us?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer competitive benefits and a great working environment
            </p>
          </MotionBox>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon

              return (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group h-full rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 sm:p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div
                      className={`mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${benefit.color}`}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </MotionBox>
              )
            })}
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Open Positions
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our current job openings and find your next opportunity
            </p>
          </MotionBox>

          <div className="space-y-4 max-w-4xl mx-auto">
            {openings.map((job, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="group rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => router.push('/contact')}
                      colorPalette="primary"
                      className="w-full sm:w-auto"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </MotionBox>
            ))}
          </div>

          {/* No position found CTA */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-8 sm:p-12 shadow-sm max-w-2xl mx-auto">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3">
                Don&#39;t see a role that fits?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                We&#39;re always looking for talented people. Send us your
                resume and we&#39;ll keep you in mind for future opportunities.
              </p>
              <Button
                onClick={() => router.push('/contact')}
                colorPalette="primary"
                size="lg"
              >
                Get in Touch
              </Button>
            </div>
          </MotionBox>
        </section>
      </div>
    </div>
  )
}
