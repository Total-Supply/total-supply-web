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
      className="space-y-6"
    >
      {/* Title Section */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
            <Headphones className="h-7 w-7 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          How can we help you?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search our knowledge base or get in touch with our support team
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for help articles, FAQs, or topics..."
            className="w-full rounded-full border border-border/60 bg-card/95 pl-12 pr-12 py-4 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Quick Suggestions */}
        {!searchQuery && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 text-center">
              Popular searches
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {['Order tracking', 'Returns', 'Payment methods', 'Delivery'].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSearchChange(suggestion)}
                    className="rounded-full bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted transition-colors"
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
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          <span>Available 24/7</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Average response time: 2 hours</span>
        </div>
      </div>
    </MotionBox>
  )
}
