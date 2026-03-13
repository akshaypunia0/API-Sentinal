import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardCardProps {
  title: string
  icon?: React.ReactNode
  data: number | string
  suffix?: string
  description?: string
  accentClass?: string   // e.g. 'bg-blue-400/10 text-blue-400'
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  data,
  suffix = '',
  description,
  accentClass = 'bg-white/10 text-white/60',
}) => {
  return (
    <Card className="group relative overflow-hidden card-hover border-border bg-card">
      {/* Subtle top-edge gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm ${accentClass} transition-transform duration-200 group-hover:scale-105`}>
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'h-4 w-4' })
              : icon}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {data}{suffix}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardCard