'use client'

import { MotionBox } from '@/src/components/motion/box'
import { HStack, Text } from '@chakra-ui/react'
import { Filter, Search, Sparkles, X } from 'lucide-react'

import { Button } from '../ui/button'

type ShopHeaderProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  recentSearches: string[]
  onSelectRecent: (value: string) => void
  resultsCount?: number
  hasFilters: boolean
  onClearAll: () => void
  onToggleFilters: () => void
  showFilters: boolean
}

export function ShopHeader({
  searchValue,
  onSearchChange,
  onClearSearch,
  recentSearches,
  onSelectRecent,
  resultsCount,
  hasFilters,
  onClearAll,
  onToggleFilters,
  showFilters,
}: ShopHeaderProps) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Title Section */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Total Supply Catalog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fresh ingredients and quality food items, updated daily
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
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, description, or ingredient..."
            className="w-full rounded-full border border-border/60 bg-card/95 pl-12 pr-12 py-4 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
          />
          {searchValue && (
            <button
              onClick={onClearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Search Results Count */}
        {typeof resultsCount === 'number' && searchValue && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            <Sparkles className="inline h-4 w-4 mr-1" />
            Found {resultsCount} product{resultsCount !== 1 ? 's' : ''} for
            &quot;{searchValue}&quot;
          </p>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchValue && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 text-center">
              Recent searches
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => onSelectRecent(item)}
                  className="rounded-full bg-muted/50 px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Row - Fixed */}
      <div className="flex justify-center">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <Text color="muted">Fresh daily inventory</Text>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <Text color="muted">Fast delivery available</Text>
          </div>

          <div className="hidden sm:block h-4 w-px bg-border/60" />

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <Text color="muted">Quality guaranteed</Text>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 rounded-full bg-card border border-border/60 px-4 py-2 text-sm font-medium hover:bg-muted transition-colors lg:hidden"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide' : 'Show'} Filters
          {hasFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
              !
            </span>
          )}
        </button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="ml-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear All Filters
          </Button>
        )}
      </div>
    </MotionBox>
  )
}
