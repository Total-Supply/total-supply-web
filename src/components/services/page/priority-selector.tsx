import { AlertCircle, Clock, Flame, Zap } from 'lucide-react'

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

type PrioritySelectorProps = {
  value: Priority
  onChange: (priority: Priority) => void
}

const PRIORITY_OPTIONS = [
  {
    value: 'LOW' as Priority,
    label: 'Low',
    icon: Clock,
    color:
      'from-slate-500/20 to-slate-600/10 text-slate-700 dark:text-slate-400 ring-slate-500/30',
    activeColor: 'from-slate-500 to-slate-600 text-white shadow-slate-500/30',
    description: 'Within 7 days',
  },
  {
    value: 'MEDIUM' as Priority,
    label: 'Medium',
    icon: AlertCircle,
    color:
      'from-blue-500/20 to-blue-600/10 text-blue-700 dark:text-blue-400 ring-blue-500/30',
    activeColor: 'from-blue-500 to-blue-600 text-white shadow-blue-500/30',
    description: 'Within 3 days',
  },
  {
    value: 'HIGH' as Priority,
    label: 'High',
    icon: Zap,
    color:
      'from-amber-500/20 to-amber-600/10 text-amber-700 dark:text-amber-400 ring-amber-500/30',
    activeColor: 'from-amber-500 to-amber-600 text-white shadow-amber-500/30',
    description: 'Within 24 hours',
  },
  {
    value: 'URGENT' as Priority,
    label: 'Urgent',
    icon: Flame,
    color:
      'from-red-500/20 to-red-600/10 text-red-700 dark:text-red-400 ring-red-500/30',
    activeColor: 'from-red-500 to-red-600 text-white shadow-red-500/30',
    description: 'ASAP',
  },
]

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PRIORITY_OPTIONS.map((option) => {
        const isSelected = value === option.value
        const Icon = option.icon

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`group relative flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all duration-200 ${
              isSelected
                ? `border-transparent bg-gradient-to-br ${option.activeColor} shadow-lg`
                : `border-border/60 bg-gradient-to-br ${option.color} hover:border-border hover:shadow-md`
            }`}
          >
            <Icon
              className={`h-5 w-5 transition-transform duration-200 ${
                isSelected ? 'scale-110' : 'group-hover:scale-105'
              }`}
            />
            <div>
              <p className="text-sm font-semibold">{option.label}</p>
              <p
                className={`text-xs mt-0.5 ${
                  isSelected ? 'text-white/90' : 'text-muted-foreground'
                }`}
              >
                {option.description}
              </p>
            </div>

            {isSelected && (
              <div className="absolute inset-0 rounded-lg ring-2 ring-current pointer-events-none" />
            )}
          </button>
        )
      })}
    </div>
  )
}
