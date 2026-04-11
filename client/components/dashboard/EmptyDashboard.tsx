'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FolderOpen, Globe, ArrowRight, BarChart3, Activity } from 'lucide-react'

interface EmptyDashboardProps {
  hasNoProjects: boolean
  hasNoApis: boolean
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ hasNoProjects, hasNoApis }) => {
  const router = useRouter()

  const heading = hasNoProjects
    ? 'No Projects Yet'
    : 'No APIs Registered'

  const description = hasNoProjects
    ? "You haven't created any projects yet. Create your first project to start monitoring your APIs and get real-time insights on your dashboard."
    : "You have projects but no APIs registered. Register your first API endpoint under the project to start tracking response times, uptime, and health status."

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[520px] rounded-2xl overflow-hidden">

      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg px-6">

        {/* Animated icon cluster */}
        <div className="relative mb-8">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full animate-glow-pulse" />

          {/* Main icon container */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white/4 border border-white/8 animate-float">
            {hasNoProjects ? (
              <FolderOpen className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
            ) : (
              <Globe className="h-10 w-10 text-muted-foreground/60" strokeWidth={1.5} />
            )}
          </div>

          {/* Floating decorative badges */}
          <div className="absolute -top-2 -right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10 border border-blue-400/20 animate-float animation-delay-200">
            <BarChart3 className="h-3.5 w-3.5 text-blue-400/70" />
          </div>
          <div className="absolute -bottom-1 -left-4 flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10 border border-emerald-400/20 animate-float animation-delay-400">
            <Activity className="h-3 w-3 text-emerald-400/70" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold tracking-tight gradient-text mb-3">
          {heading}
        </h2>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground max-w-md mb-8">
          {description}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {hasNoProjects ? (
            <Button
              onClick={() => router.push('/projects')}
              className="btn-gradient text-foreground rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 group"
            >
              <FolderOpen className="h-4 w-4" />
              Create Your First Project
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          ) : (
            <>
              <Button
                onClick={() => router.push('/projects')}
                className="btn-gradient text-foreground rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2 group"
              >
                <Globe className="h-4 w-4" />
                Register an API
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/check')}
                className="text-muted-foreground hover:text-foreground rounded-lg px-6 py-2.5 text-sm font-medium flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Try API Checker
              </Button>
            </>
          )}
        </div>

        {/* Bottom hint */}
        <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground/50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/40 animate-pulse" />
          <span>Dashboard data will appear here once you start monitoring</span>
        </div>
      </div>
    </div>
  )
}

export default EmptyDashboard
