'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/ui/collapsible'
import { Input } from '@/src/components/ui/input'
import { Separator } from '@/src/components/ui/separator'
import { Textarea } from '@/src/components/ui/textarea'
import { ChevronDown, CalendarClock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type ServiceHistory = {
  id: number
  requestNumber: string
  status: string
  createdAt: string
}

type ServicePhoto = {
  id: number
  url: string
  type: string
}

type ITAssignment = {
  id: number
  status: string
  assignedAt: string
  acceptedAt?: string | null
  startedAt?: string | null
  notes?: string | null
  timeSpentMinutes?: number | null
  request: {
    id: number
    requestNumber: string
    type: string
    status: string
    priority: string
    requestedDate?: string | null
    createdAt: string
    description: string
    notes?: string | null
    customer: {
      id: number
      name: string
      phone?: string | null
    }
    address?: {
      line1: string
      line2?: string | null
      city: string
      postalCode: string
      country?: string | null
    } | null
    photos: ServicePhoto[]
    history: ServiceHistory[]
  }
}

const STATUS_OPTIONS = ['ALL', 'ASSIGNED', 'IN_PROGRESS']
const PRIORITY_OPTIONS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']
const STORAGE_KEY = 'total-supply-it-last-seen'

export function ITServicesPage() {
  const [services, setServices] = useState<ITAssignment[]>([])
  const [status, setStatus] = useState('ALL')
  const [priority, setPriority] = useState('ALL')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [actionMessage, setActionMessage] = useState<Record<number, string>>({})
  const [progressNotes, setProgressNotes] = useState<Record<number, string>>({})
  const [progressFiles, setProgressFiles] = useState<Record<number, File[]>>({})
  const [timeSpent, setTimeSpent] = useState<Record<number, string>>({})
  const [completeNotes, setCompleteNotes] = useState<Record<number, string>>({})
  const [solutionSummary, setSolutionSummary] = useState<Record<number, string>>({})
  const [followUps, setFollowUps] = useState<Record<number, string>>({})
  const [completeFiles, setCompleteFiles] = useState<Record<number, File[]>>({})
  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? Number(stored) : 0
  })

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (status !== 'ALL') {
        params.set('status', status)
      }
      if (priority !== 'ALL') {
        params.set('priority', priority)
      }
      if (date) {
        params.set('date', date)
      }
      const response = await fetch(`/api/staff/it/services?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load services')
      }
      const list = (data.data || []) as ITAssignment[]
      list.sort((a, b) => {
        const aDate = a.request.requestedDate || a.request.createdAt
        const bDate = b.request.requestedDate || b.request.createdAt
        return new Date(aDate).getTime() - new Date(bDate).getTime()
      })
      setServices(list)
    } catch (error) {
      console.error('Failed to load IT services', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [status, priority, date])

  useEffect(() => {
    const interval = setInterval(fetchServices, 15000)
    return () => clearInterval(interval)
  }, [status, priority, date])

  const newCount = useMemo(() => {
    if (!lastSeen) return 0
    return services.filter(
      (service) =>
        new Date(service.request.createdAt).getTime() > lastSeen,
    ).length
  }, [services, lastSeen])

  const markSeen = () => {
    const latest = services[0]?.request.createdAt
    const latestTime = latest ? new Date(latest).getTime() : Date.now()
    setLastSeen(latestTime)
    window.localStorage.setItem(STORAGE_KEY, String(latestTime))
  }

  const handleAccept = async (entry: ITAssignment) => {
    setActionLoading(entry.id)
    setActionMessage((prev) => ({ ...prev, [entry.id]: '' }))
    try {
      const response = await fetch(
        `/api/staff/it/services/${entry.request.id}/accept`,
        { method: 'POST' },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Accept failed')
      }
      setActionMessage((prev) => ({
        ...prev,
        [entry.id]: 'Service accepted. Customer notified.',
      }))
      await fetchServices()
    } catch (error) {
      console.error('Failed to accept IT service', error)
      setActionMessage((prev) => ({
        ...prev,
        [entry.id]: 'Unable to accept this service right now.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[entry.id]
          return next
        })
      }, 4000)
    }
  }

  const uploadPhotos = async (files: File[]) => {
    const uploads = files.slice(0, 5)
    const results: string[] = []
    for (const file of uploads) {
      const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: safeFilename,
          contentType: file.type,
          fileSize: file.size,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload initialization failed')
      }
      const uploadResponse = await fetch(data.data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      })
      if (!uploadResponse.ok) {
        throw new Error('Image upload failed')
      }
      results.push(data.data.publicUrl as string)
    }
    return results
  }

  const handleProgress = async (entry: ITAssignment) => {
    setActionLoading(entry.id)
    setActionMessage((prev) => ({ ...prev, [entry.id]: '' }))
    try {
      const files = progressFiles[entry.id] || []
      const photoUrls = files.length ? await uploadPhotos(files) : []
      const notes = progressNotes[entry.id]?.trim()
      const minutes = timeSpent[entry.id]
        ? Number(timeSpent[entry.id])
        : undefined
      const response = await fetch(
        `/api/staff/it/services/${entry.request.id}/progress`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notes: notes || undefined,
            photos: photoUrls.length ? photoUrls : undefined,
            timeSpentMinutes: minutes,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Progress update failed')
      }
      setProgressNotes((prev) => ({ ...prev, [entry.id]: '' }))
      setProgressFiles((prev) => ({ ...prev, [entry.id]: [] }))
      setTimeSpent((prev) => ({ ...prev, [entry.id]: '' }))
      setActionMessage((prev) => ({
        ...prev,
        [entry.id]: 'Progress updated. Customer notified.',
      }))
      await fetchServices()
    } catch (error: any) {
      console.error('Failed to update IT progress', error)
      setActionMessage((prev) => ({
        ...prev,
        [entry.id]: error?.message || 'Unable to update progress.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[entry.id]
          return next
        })
      }, 4000)
    }
  }

  const handleComplete = async (entry: ITAssignment) => {
    setActionLoading(entry.id)
    setActionMessage((prev) => ({ ...prev, [entry.id]: '' }))
    try {
      const files = completeFiles[entry.id] || []
      if (!files.length) {
        throw new Error('Upload at least one after photo.')
      }
      const completion = completeNotes[entry.id]?.trim()
      const summary = solutionSummary[entry.id]?.trim()
      if (!completion || !summary) {
        throw new Error('Completion notes and solution summary are required.')
      }
      const photoUrls = await uploadPhotos(files)
      const response = await fetch(
        `/api/staff/it/services/${entry.request.id}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completionNotes: completion,
            solutionSummary: summary,
            followUpRecommendations: followUps[entry.id]?.trim() || undefined,
            photos: photoUrls,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error?.message || 'Completion failed')
      }
      setCompleteNotes((prev) => ({ ...prev, [entry.id]: '' }))
      setSolutionSummary((prev) => ({ ...prev, [entry.id]: '' }))
      setFollowUps((prev) => ({ ...prev, [entry.id]: '' }))
      setCompleteFiles((prev) => ({ ...prev, [entry.id]: [] }))
      setActionMessage((prev) => ({
        ...prev,
        [entry.id]: 'Service completed and customer notified.',
      }))
      await fetchServices()
    } catch (error: any) {
      console.error('Failed to complete IT service', error)
      setActionMessage((prev) => ({
        ...prev,
        [entry.id]: error?.message || 'Unable to complete service.',
      }))
    } finally {
      setActionLoading(null)
      window.setTimeout(() => {
        setActionMessage((prev) => {
          const next = { ...prev }
          delete next[entry.id]
          return next
        })
      }, 4000)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 pt-2">
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-semibold">My IT services</h1>
          <p className="text-sm text-muted-foreground">
            Assigned IT support jobs and diagnostics.
          </p>
        </div>
        <Button variant="outline" onClick={markSeen}>
          Mark all as read
        </Button>
      </MotionBox>

      <div className="flex flex-wrap items-center gap-3">
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={status === option ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatus(option)}
          >
            {option.replace(/_/g, ' ')}
          </Button>
        ))}
        {PRIORITY_OPTIONS.map((option) => (
          <Button
            key={option}
            variant={priority === option ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPriority(option)}
          >
            {option}
          </Button>
        ))}
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-[160px]"
          />
          {date && (
            <Button size="sm" variant="ghost" onClick={() => setDate('')}>
              Clear
            </Button>
          )}
        </div>
        {newCount > 0 && <Badge variant="secondary">{newCount} new</Badge>}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          Loading IT services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          No assigned IT services yet.
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((entry) => (
            <Collapsible
              key={entry.id}
              className="rounded-xl border border-border/60 bg-card"
            >
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between gap-4 p-4 text-left">
                  <div>
                    <p className="text-sm font-semibold">
                      {entry.request.requestNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.request.customer.name} - {entry.request.priority.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {entry.request.status.toLowerCase().replace(/_/g, ' ')}
                    </Badge>
                    {new Date(entry.request.createdAt).getTime() > lastSeen && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator />
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Customer</p>
                      <p className="text-muted-foreground">
                        {entry.request.customer.name}
                        {entry.request.customer.phone
                          ? ` - ${entry.request.customer.phone}`
                          : ''}
                      </p>
                    </div>
                    {entry.request.address && (
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">
                          {entry.request.address.line1}
                          {entry.request.address.line2
                            ? `, ${entry.request.address.line2}`
                            : ''}
                          {`, ${entry.request.address.city} ${entry.request.address.postalCode}`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">Issue description</p>
                      <p className="text-muted-foreground">
                        {entry.request.description}
                      </p>
                    </div>
                    {entry.request.notes && (
                      <div>
                        <p className="font-medium">Special notes</p>
                        <p className="text-muted-foreground">{entry.request.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Scheduled</p>
                      <p className="text-muted-foreground">
                        {entry.request.requestedDate
                          ? new Date(entry.request.requestedDate).toLocaleString()
                          : 'Not scheduled'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Assigned</p>
                      <p className="text-muted-foreground">
                        {new Date(entry.assignedAt).toLocaleString()}
                      </p>
                    </div>
                    {entry.request.status === 'ASSIGNED' && (
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(entry)}
                          disabled={actionLoading === entry.id}
                        >
                          Accept
                        </Button>
                        {actionMessage[entry.id] && (
                          <span className="text-xs text-muted-foreground">
                            {actionMessage[entry.id]}
                          </span>
                        )}
                      </div>
                    )}
                    {entry.request.photos.length > 0 && (
                      <div>
                        <p className="font-medium">Diagnostic photos</p>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {entry.request.photos.map((photo) => (
                            <div
                              key={photo.id}
                              className="h-20 overflow-hidden rounded-lg border"
                            >
                              <img
                                src={photo.url}
                                alt="Diagnostic"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.request.status === 'IN_PROGRESS' && (
                      <div className="space-y-2">
                        <p className="font-medium">Troubleshooting update</p>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(event) =>
                            setProgressFiles((prev) => ({
                              ...prev,
                              [entry.id]: Array.from(event.target.files || []),
                            }))
                          }
                        />
                        <Textarea
                          className="h-20"
                          placeholder="Troubleshooting notes (optional)"
                          value={progressNotes[entry.id] || ''}
                          onChange={(event) =>
                            setProgressNotes((prev) => ({
                              ...prev,
                              [entry.id]: event.target.value,
                            }))
                          }
                        />
                        <Input
                          type="number"
                          min={1}
                          max={480}
                          placeholder="Time spent (minutes)"
                          value={timeSpent[entry.id] || ''}
                          onChange={(event) =>
                            setTimeSpent((prev) => ({
                              ...prev,
                              [entry.id]: event.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProgress(entry)}
                          disabled={actionLoading === entry.id}
                        >
                          Update progress
                        </Button>
                        {actionMessage[entry.id] && (
                          <span className="text-xs text-muted-foreground">
                            {actionMessage[entry.id]}
                          </span>
                        )}
                      </div>
                    )}
                    {entry.request.status === 'IN_PROGRESS' && (
                      <div className="space-y-2">
                        <p className="font-medium">Complete service</p>
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(event) =>
                            setCompleteFiles((prev) => ({
                              ...prev,
                              [entry.id]: Array.from(event.target.files || []),
                            }))
                          }
                        />
                        <Textarea
                          className="h-20"
                          placeholder="Final notes (required)"
                          value={completeNotes[entry.id] || ''}
                          onChange={(event) =>
                            setCompleteNotes((prev) => ({
                              ...prev,
                              [entry.id]: event.target.value,
                            }))
                          }
                        />
                        <Textarea
                          className="h-20"
                          placeholder="Solution summary (required)"
                          value={solutionSummary[entry.id] || ''}
                          onChange={(event) =>
                            setSolutionSummary((prev) => ({
                              ...prev,
                              [entry.id]: event.target.value,
                            }))
                          }
                        />
                        <Textarea
                          className="h-20"
                          placeholder="Recommended follow-ups"
                          value={followUps[entry.id] || ''}
                          onChange={(event) =>
                            setFollowUps((prev) => ({
                              ...prev,
                              [entry.id]: event.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          onClick={() => handleComplete(entry)}
                          disabled={actionLoading === entry.id}
                        >
                          Complete service
                        </Button>
                        {actionMessage[entry.id] && (
                          <span className="text-xs text-muted-foreground">
                            {actionMessage[entry.id]}
                          </span>
                        )}
                      </div>
                    )}
                    {entry.notes && (
                      <div>
                        <p className="font-medium">Troubleshooting log</p>
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground whitespace-pre-line">
                          {entry.notes.split('\n').map((line, index) => (
                            <div key={`${entry.id}-note-${index}`}>{line}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.request.history.length > 0 && (
                      <div>
                        <p className="font-medium">Previous IT history</p>
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {entry.request.history.map((history) => (
                            <div key={history.id}>
                              {history.requestNumber} - {history.status.toLowerCase()} (
                              {new Date(history.createdAt).toLocaleDateString()})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  )
}


