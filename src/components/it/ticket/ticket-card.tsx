'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Timer,
  User,
} from 'lucide-react'
import Link from 'next/link'

import { ITServiceStatusBadge } from '../services/it-service-status-badge'

type TicketCardProps = {
  ticket: {
    id: number
    requestNumber: string
    status: string
    priority: string
    description: string
    createdAt: string
    requestedDate: string | null
    customer: {
      name: string
      phone?: string | null
    }
    address: {
      line1: string
      city: string
    } | null
    assignment: {
      id: number
      acceptedAt: string | null
      completedAt: string | null
      timeSpentMinutes: number | null
      completionNotes: string | null
      solutionSummary: string | null
    } | null
    photos: Array<{ id: number; url: string; type: string }>
    _count: {
      photos: number
    }
  }
  onClick: () => void
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDuration = () => {
    if (!ticket.assignment?.acceptedAt) return null
    const start = new Date(ticket.assignment.acceptedAt)
    const end = ticket.assignment.completedAt
      ? new Date(ticket.assignment.completedAt)
      : new Date()
    const hours = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60),
    )
    const minutes =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60)) % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-4 shadow-sm transition-all duration-300 hover:border-border hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">
                #{ticket.requestNumber}
              </span>
              {ticket.status === 'RESOLVED' && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ITServiceStatusBadge status={ticket.status} size="sm" />
              <ITServiceStatusBadge
                status={ticket.status}
                priority={ticket.priority}
                size="sm"
              />
            </div>
          </div>
          {ticket.assignment?.timeSpentMinutes && (
            <Badge variant="subtle" className="gap-1.5">
              <Timer className="h-3 w-3" />
              {ticket.assignment.timeSpentMinutes}m
            </Badge>
          )}
        </div>

        {/* Description */}
        <div className="rounded-lg bg-muted/30 p-2.5">
          <p className="text-sm line-clamp-2">{ticket.description}</p>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-2 text-xs">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{ticket.customer.name}</span>
          {ticket.address && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground truncate">
                {ticket.address.city}
              </span>
            </>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(ticket.createdAt)}</span>
          </div>
          {getDuration() && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{getDuration()}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex items-center gap-3">
            {ticket._count.photos > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
                <span>{ticket._count.photos}</span>
              </div>
            )}
            {ticket.assignment?.solutionSummary && (
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <FileText className="h-3.5 w-3.5" />
                <span>Documented</span>
              </div>
            )}
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </MotionBox>
  )
}
