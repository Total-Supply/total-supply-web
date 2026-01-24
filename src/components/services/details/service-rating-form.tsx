'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { useToast } from '@/src/hooks/use-toast'
import { Textarea } from '@chakra-ui/react'
import { Loader2, Star, ThumbsUp } from 'lucide-react'

import { useState } from 'react'

type ServiceRatingFormProps = {
  serviceId: number
  onRatingSubmitted: () => void
}

export function ServiceRatingForm({
  serviceId,
  onRatingSubmitted,
}: ServiceRatingFormProps) {
  const toast = useToast()
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [recommend, setRecommend] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/service-requests/${serviceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          score: rating,
          review: review || undefined,
          wouldRecommend: recommend,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Rating failed')
      }

      toast({
        title: 'Thank you for your feedback! 🎉',
        description: 'Your rating helps us improve our service',
        status: 'success',
        duration: 3000,
      })

      onRatingSubmitted()
    } catch (error) {
      toast({
        title: 'Failed to submit rating',
        description:
          error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/30">
          <Star className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Rate This Service</h3>
          <p className="text-xs text-muted-foreground">
            How was your experience?
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Star Rating */}
        <div>
          <p className="text-sm font-medium mb-3">Overall Rating</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <Star
                  className={`h-10 w-10 transition-colors duration-200 ${
                    value <= (hoveredRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-lg font-semibold">{rating} / 5</span>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Share Your Feedback (Optional)
          </label>
          <Textarea
            placeholder="Tell us about your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {review.length}/500 characters
          </p>
        </div>

        {/* Recommendation */}
        <button
          onClick={() => setRecommend(!recommend)}
          className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
            recommend
              ? 'border-primary bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg shadow-primary/20'
              : 'border-border/60 bg-gradient-to-br from-card/50 to-card/30 hover:border-border'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ${
                recommend
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                Would you recommend this service?
              </p>
              <p className="text-xs text-muted-foreground">
                {recommend ? 'Yes, I would recommend' : 'Click to recommend'}
              </p>
            </div>
          </div>
        </button>

        {/* Submit Button */}
        <Button
          colorPalette="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Star className="mr-2 h-5 w-5" />
              Submit Rating
            </>
          )}
        </Button>
      </div>
    </MotionBox>
  )
}
