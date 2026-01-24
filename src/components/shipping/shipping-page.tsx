'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Clock, DollarSign, MapPin, Package, Truck } from 'lucide-react'

export function ShippingPage() {
  const deliveryZones = [
    { zone: 'Colombo City', time: 'Same day', cost: 'LKR 200' },
    { zone: 'Greater Colombo', time: '1-2 days', cost: 'LKR 300' },
    { zone: 'Western Province', time: '2-3 days', cost: 'LKR 400' },
    { zone: 'Other Areas', time: '3-5 days', cost: 'LKR 500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
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
                <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 sm:mb-4">
              Shipping Information
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Fast and reliable delivery across Sri Lanka
            </p>
          </MotionBox>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-20">
        <section className="max-w-4xl mx-auto">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 sm:p-8 lg:p-10 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                Delivery Zones & Rates
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold">
                        Zone
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold">
                        Delivery Time
                      </th>
                      <th className="text-left py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryZones.map((zone, index) => (
                      <tr
                        key={index}
                        className="border-b border-border/40 last:border-0"
                      >
                        <td className="py-3 px-2 sm:px-4 text-sm sm:text-base">
                          {zone.zone}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-muted-foreground">
                          {zone.time}
                        </td>
                        <td className="py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold">
                          {zone.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-4 sm:p-6 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm sm:text-base font-medium text-primary">
                  📦 Free shipping on orders over LKR 5,000 within Colombo!
                </p>
              </div>
            </div>
          </MotionBox>
        </section>
      </div>
    </div>
  )
}
