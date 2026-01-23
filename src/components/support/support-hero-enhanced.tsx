import { MotionBox } from '@/src/components/motion/box'
import { Headphones, HelpCircle, Search, Sparkles, X } from 'lucide-react'

type SupportHeroProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SupportHero({ searchQuery, onSearchChange }: SupportHeroProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-4xl mx-auto"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30 shadow-lg">
          <Headphones className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3 sm:mb-4">
        How can we help you?
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
        Search our knowledge base or get in touch with our support team
      </p>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for help articles, FAQs, or topics..."
            className="w-full rounded-full border border-border/60 bg-card/95 pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Quick Suggestions */}
        {!searchQuery && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">
              Popular searches
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {['Order tracking', 'Returns', 'Payment methods', 'Delivery'].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSearchChange(suggestion)}
                    className="rounded-full bg-muted/50 px-3 py-1.5 text-xs sm:text-sm hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span>Available 24/7</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline">
            Average response time: 2 hours
          </span>
          <span className="sm:hidden">Response: 2hrs</span>
        </div>
      </div>
    </MotionBox>
  )
}
