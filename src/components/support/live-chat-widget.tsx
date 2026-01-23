'use client'

import { MotionBox } from '@/src/components/motion/box'
import { Maximize2, Minimize2, Paperclip, Send, X } from 'lucide-react'

import { useState } from 'react'

type LiveChatWidgetProps = {
  isOpen: boolean
  onClose: () => void
}

type Message = {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export function LiveChatWidget({ isOpen, onClose }: LiveChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputValue('')

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. An agent will respond shortly.',
        sender: 'agent',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentResponse])
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        height: isMinimized ? 'auto' : undefined,
      }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-full max-w-md rounded-xl sm:rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden ${
        isMinimized ? '' : 'h-[500px] sm:h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary to-primary/80 p-3 sm:p-4 text-white">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm">
              CS
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm sm:text-base truncate">
              Customer Support
            </p>
            <p className="text-xs text-white/80 truncate">
              Typically replies in minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[calc(100%-120px)] sm:h-[400px] overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-card border border-border/60'
                  }`}
                >
                  <p className="text-xs sm:text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-white/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border/60 bg-card p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg hover:bg-muted transition-colors">
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-border/60 bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={handleSend}
                className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </MotionBox>
  )
}
