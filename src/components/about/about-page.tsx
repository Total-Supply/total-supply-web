'use client'

import { MotionBox } from '@/src/components/motion/box'
import {
  Award,
  Eye,
  Heart,
  Package,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

export function AboutPage() {
  const stats = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Happy Customers',
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      icon: Package,
      value: '100,000+',
      label: 'Orders Delivered',
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
    {
      icon: Award,
      value: '5 Years',
      label: 'In Business',
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    },
    {
      icon: TrendingUp,
      value: '99%',
      label: 'Satisfaction Rate',
      color:
        'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
    },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description:
        'We put our customers at the heart of everything we do, ensuring satisfaction with every interaction',
      color: 'from-pink-500/20 to-pink-600/10 text-pink-400 ring-pink-500/30',
    },
    {
      icon: Sparkles,
      title: 'Quality Excellence',
      description:
        'We maintain the highest standards in product quality and service delivery',
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
    },
    {
      icon: Target,
      title: 'Reliability',
      description:
        'Consistent, dependable service you can count on, every single time',
      color:
        'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description:
        'Continuously improving our platform to serve you better with cutting-edge technology',
      color:
        'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
    },
  ]

  const team = [
    {
      name: 'Ravindu Silva',
      role: 'Chief Executive Officer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravindu',
    },
    {
      name: 'Amara Fernando',
      role: 'Chief Operating Officer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara',
    },
    {
      name: 'Kasun Perera',
      role: 'Head of Technology',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kasun',
    },
    {
      name: 'Nethmi Jayasinghe',
      role: 'Head of Customer Success',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nethmi',
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
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 sm:mb-4">
              About Total Supply
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground">
              Your trusted partner for quality products and professional
              services across Sri Lanka
            </p>
          </MotionBox>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-20 lg:space-y-24">
        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon

              return (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group text-center rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm hover:shadow-md transition-all">
                    <div
                      className={`mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tabular-nums mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </MotionBox>
              )
            })}
          </div>
        </section>

        {/* Our Story Section */}
        <section>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary mb-4">
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Our Story
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Building a Better Tomorrow
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Founded in 2020, Total Supply emerged from a simple vision:
                    to make quality products and professional services
                    accessible to everyone across Sri Lanka. What started as a
                    small food delivery service has grown into a comprehensive
                    platform offering fresh produce, professional cleaning, and
                    expert IT support.
                  </p>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Today, we serve over 50,000 customers and have delivered more
                  than 100,000 orders. Our commitment to quality, reliability,
                  and customer satisfaction remains unwavering as we continue to
                  expand our services and reach.
                </p>
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 sm:p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 ring-1 ring-blue-500/30">
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Our Mission</h3>
                      <p className="text-sm text-muted-foreground">
                        To provide exceptional products and services that
                        enhance the daily lives of our customers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 ring-1 ring-purple-500/30">
                      <Eye className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Our Vision</h3>
                      <p className="text-sm text-muted-foreground">
                        To become Sri Lanka&#39;s most trusted and comprehensive
                        supply and service platform
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MotionBox>
        </section>

        {/* Values Section */}
        <section>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Our Values
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </MotionBox>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon

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
                      className={`mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-300 group-hover:scale-110 ${value.color}`}
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </MotionBox>
              )
            })}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Meet Our Team
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind Total Supply
            </p>
          </MotionBox>

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="group text-center rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-24 w-24 sm:h-28 sm:w-28 mx-auto rounded-full ring-4 ring-primary/20 mb-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <h3 className="text-base sm:text-lg font-semibold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </MotionBox>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
