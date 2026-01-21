'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const STATUS_FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const

type StatusFilter = (typeof STATUS_FILTERS)[number]

export function ITTicketsPage() {
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [query, setQuery] = useState('')

  const activeFilters = useMemo(() => {
    const filters: string[] = []
    if (status !== 'ALL') filters.push(status)
    if (query.trim()) filters.push(`Search: "${query.trim()}"`)
    return filters
  }, [query, status])

  return (
    <div className="flex flex-col gap-6 p-6 pt-2">
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-semibold">IT tickets</h1>
          <p className="text-sm text-muted-foreground">
            Track diagnostics, notes, and resolution status.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/it">Back to dashboard</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard/it/tickets">Refresh</Link>
          </Button>
        </div>
      </MotionBox>

      <div className="grid gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm md:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-sm font-semibold">Search tickets</p>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by customer, issue, or ticket ID"
            className="mt-2"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter}
                variant={status === filter ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setStatus(filter)}
              >
                {filter.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border/60 bg-card p-6 text-sm text-muted-foreground">
        <p>
          Ticket views will surface IT requests with detailed diagnostics,
          notes, and status changes. Hook this list up to your IT queue data
          once you confirm the ticket schema.
        </p>
        {activeFilters.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="subtle">
                {filter}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}


