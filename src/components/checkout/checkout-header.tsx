'use client'

import { MotionBox } from '@/src/components/motion/box'
import { LucideIcon } from 'lucide-react'

type Step = {
  number: number
  title: string
  icon: LucideIcon
}

type CheckoutHeaderProps = {
  currentStep: number
  steps: Step[]
  itemCount: number
}

export function CheckoutHeader({
  currentStep,
  steps,
  itemCount,
}: CheckoutHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Title Section - Centered */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Checkout
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete your order securely
        </p>
      </div>

      {/* Progress Steps - Centered */}
      <div className="flex justify-center">
        <div className="flex items-center max-w-xl w-full">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all ${
                    currentStep >= step.number
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'border-border bg-background'
                  }`}
                >
                  <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs sm:text-sm mt-2 font-medium hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all ${
                    currentStep > step.number ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row - Centered */}
      <div className="flex justify-center">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
            </span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Secure checkout</span>
          </div>
        </div>
      </div>
    </MotionBox>
  )
}
