import { MotionBox } from '@/src/components/motion/box'
import { Clock, MessageCircle, Star, Users } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '50K+',
    label: 'Happy Customers',
    color: 'from-blue-500/20 to-blue-600/10 text-blue-500 ring-blue-500/30',
  },
  {
    icon: MessageCircle,
    value: '10K+',
    label: 'Tickets Resolved',
    color:
      'from-emerald-500/20 to-emerald-600/10 text-emerald-500 ring-emerald-500/30',
  },
  {
    icon: Clock,
    value: '< 2hrs',
    label: 'Avg Response Time',
    color: 'from-amber-500/20 to-amber-600/10 text-amber-500 ring-amber-500/30',
  },
  {
    icon: Star,
    value: '4.8/5',
    label: 'Support Rating',
    color:
      'from-purple-500/20 to-purple-600/10 text-purple-500 ring-purple-500/30',
  },
]

export function SupportStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <MotionBox
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 to-card/60 p-6 text-center shadow-sm"
        >
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 mb-3 ${stat.color}`}
          >
            <stat.icon className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold mb-1">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </MotionBox>
      ))}
    </div>
  )
}
