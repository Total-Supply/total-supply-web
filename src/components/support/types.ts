export type TicketFormData = {
  subject: string
  category: string
  priority: string
  description: string
  attachments?: string[]
}

export type SupportTicket = {
  id: number
  ticketNumber: string
  subject: string
  category: string
  priority: string
  status: string
  description: string
  createdAt: string
  updatedAt: string
  responses?: TicketResponse[]
}

export type TicketResponse = {
  id: number
  message: string
  isStaff: boolean
  createdAt: string
  author?: {
    name: string
    avatar?: string
  }
}
