'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Button } from '@/src/components/ui/button'
import { IconActionButton } from '@/src/components/ui/icon-action-button'
import { Input } from '@/src/components/ui/input'
import { useToast } from '@/src/hooks/use-toast'
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react'
import Link from 'next/link'

import { useEffect, useMemo, useState } from 'react'

import { TicketCard } from './ticket-card'
import { TicketDetailDialog } from './ticket-detail-dialog'

type Ticket = {
  id: number
  requestNumber: string
  status: string
  priority: string
  description: string
  notes: string | null
  createdAt: string
  requestedDate: string | null
  customer: {
    id: number
    name: string
    phone: string | null
  }
  address: {
    line1: string
    line2: string | null
    city: string
    postalCode: string
  } | null
  assignment: {
    id: number
    assignedAt: string
    acceptedAt: string | null
    startedAt: string | null
    completedAt: string | null
    notes: string | null
    timeSpentMinutes: number | null
    completionNotes: string | null
    solutionSummary: string | null
    followUpRecommendations: string | null
  } | null
  photos: Array<{
    id: number
    url: string
    type: string
    createdAt: string
  }>
  _count: {
    photos: number
  }
}

const STATUS_FILTERS = [
  { label: 'All Tickets', value: 'ALL' },
  { label: 'Assigned', value: 'ASSIGNED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
]

export default function ITTicketsPage() {
  const toast = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [status, setStatus] = useState('ALL')
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') params.set('status', status)
      if (query.trim()) params.set('query', query.trim())

      const response = await fetch(`/api/staff/it/tickets?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load tickets')
      }

      setTickets(data.data || [])
    } catch (error) {
      toast({
        title: 'Failed to load tickets',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        status: 'error',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await fetchTickets()
      setIsLoading(false)
    }
    load()
  }, [status])

  const handleSearch = () => {
    fetchTickets()
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchTickets()
    setIsRefreshing(false)
    toast({
      title: 'Tickets refreshed',
      status: 'success',
      duration: 2000,
    })
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setDetailOpen(true)
  }

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      assigned: tickets.filter((t) => t.status === 'ASSIGNED').length,
      inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
      resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
    }
  }, [tickets])

  return (
    <div className="container mx-auto space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      {/* Header */}
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">IT Tickets</h1>
              <p className="text-sm text-muted-foreground">
                Track diagnostics, notes, and resolution status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/it">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <IconActionButton
              icon={RefreshCw}
              label="Refresh tickets"
              variant="refresh"
              isLoading={isRefreshing}
              onClick={handleRefresh}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: 'Total',
              value: stats.total,
              color:
                'from-blue-500/20 to-blue-600/10 text-blue-400 ring-blue-500/30',
            },
            {
              label: 'Assigned',
              value: stats.assigned,
              color:
                'from-amber-500/20 to-amber-600/10 text-amber-400 ring-amber-500/30',
            },
            {
              label: 'In Progress',
              value: stats.inProgress,
              color:
                'from-purple-500/20 to-purple-600/10 text-purple-400 ring-purple-500/30',
            },
            {
              label: 'Resolved',
              value: stats.resolved,
              color:
                'from-emerald-500/20 to-emerald-600/10 text-emerald-400 ring-emerald-500/30',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm"
            >
              <p className="text-xs uppercase text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </MotionBox>

      {/* Filters */}
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter & Search</span>
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search Tickets
              </label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by customer, issue, or ticket ID"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => (
                  <Button
                    key={filter.value}
                    size="sm"
                    variant={status === filter.value ? 'solid' : 'outline'}
                    colorPalette={status === filter.value ? 'blue' : undefined}
                    onClick={() => setStatus(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MotionBox>

      {/* Tickets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-muted/50"
            />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">No tickets found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {status !== 'ALL' || query
              ? 'Try adjusting your filters'
              : 'All caught up!'}
          </p>
        </div>
      ) : (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => handleTicketClick(ticket)}
            />
          ))}
        </MotionBox>
      )}

      {/* Detail Dialog */}
      {selectedTicket && (
        <TicketDetailDialog
          isOpen={detailOpen}
          onClose={() => {
            setDetailOpen(false)
            setSelectedTicket(null)
          }}
          ticket={selectedTicket}
        />
      )}
    </div>
  )
}
