'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authUtils } from '@/lib/apiCalls/authApi'
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Zap,
} from 'lucide-react'

const features = [
  { icon: Globe, text: 'Monitor APIs across 14 global regions' },
  { icon: Zap,   text: 'Get alerted in under 8 seconds' },
  { icon: CheckCircle, text: '99.9% uptime SLA guaranteed' },
]

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await authUtils.login({ email, password })
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── LEFT: Branding panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-[#0e0e0e] border-r border-white/[0.06]">
        {/* Subtle background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/[0.03] blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-2 animate-fade-in">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/10">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">API Sentinel</span>
        </div>

        {/* Centre content */}
        <div className="relative space-y-8 animate-slide-up">
          {/* Mini live-status card */}
          <div className="glass-card rounded-2xl p-5 max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">All systems live</span>
            </div>
            <div className="space-y-2">
              {[
                { name: '/api/users',    ms: '98ms',  up: true  },
                { name: '/api/products', ms: '142ms', up: true  },
                { name: '/api/orders',   ms: '—',     up: false },
              ].map(api => (
                <div key={api.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-mono">{api.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={api.up ? 'text-muted-foreground' : 'text-red-400'}>{api.ms}</span>
                    <span className={`text-xs font-medium ${api.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {api.up ? 'UP' : 'DOWN'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-[1.2] mb-3">
              Your APIs,<br />
              <span className="gradient-text">always watched.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Real-time monitoring, instant alerts, and deep analytics — everything your team needs to keep APIs healthy.
            </p>
          </div>

          <div className="space-y-3">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 border border-white/10 flex-shrink-0">
                  <f.icon className="h-3.5 w-3.5 text-white/60" />
                </div>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="relative text-xs text-muted-foreground/60 animate-fade-in">
          © {new Date().getFullYear()} API Sentinel. Monitoring made simple.
        </p>
      </div>

      {/* ── RIGHT: Form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/10">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">API Sentinel</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1.5">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your account to continue monitoring
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-9 h-11 bg-card border-border focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-9 pr-10 h-11 bg-card border-border focus:border-white/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">Don&apos;t have an account?</span>
            </div>
          </div>

          {/* Register link */}
          <Link
            href="/register"
            className="flex items-center justify-center w-full h-11 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Create a free account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginForm