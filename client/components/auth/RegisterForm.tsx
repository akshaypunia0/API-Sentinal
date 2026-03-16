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
  BarChart3,
  Bell,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from 'lucide-react'

const perks = [
  { icon: Bell,     text: 'Instant downtime alerts via Email & SMS' },
  { icon: BarChart3, text: 'Analytics dashboard with response trends' },
  { icon: Shield,   text: 'SSL expiry & security monitoring built-in' },
]

function RegisterForm() {
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<number | null>(null)
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log("Formdata 1: ", {
      fullName,
      email,
      phone: phone || undefined,
      password,
    });
    

    try {

      console.log("Formdata 2: ", {
        fullName,
        email,
        phone: phone || undefined,
        password,
      });

      const result = await authUtils.register({
        fullName,
        email,
        phone: phone || undefined,
        password,
      })
      if (result.success) {
        router.push('/login')
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── LEFT: Branding panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-[#0e0e0e] border-r border-white/[0.06]">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-500/[0.03] blur-3xl" />
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
          {/* Animated pulse visual */}
          <div className="glass-card rounded-2xl p-5 max-w-sm space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-4">Live monitoring</p>
            {[
              { label: 'Average response time', value: '94ms',   color: 'bg-emerald-500' },
              { label: 'Uptime this month',     value: '99.98%', color: 'bg-blue-500'    },
              { label: 'Alerts resolved',        value: '42',     color: 'bg-violet-500'  },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${row.color}`} />
                  <span className="text-muted-foreground">{row.label}</span>
                </div>
                <span className="font-semibold tabular-nums">{row.value}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-[1.2] mb-3">
              Join teams that<br />
              <span className="gradient-text">never miss an outage.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Start monitoring your APIs in minutes. Free plan includes up to 10 API checks — no credit card required.
            </p>
          </div>

          <div className="space-y-3">
            {perks.map(p => (
              <div key={p.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 border border-white/10 flex-shrink-0">
                  <p.icon className="h-3.5 w-3.5 text-white/60" />
                </div>
                {p.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="relative text-xs text-muted-foreground/60 animate-fade-in">
          Free plan · No credit card · Cancel anytime
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
            <h1 className="text-3xl font-bold mb-1.5">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Start monitoring your APIs in under 2 minutes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-9 h-11 bg-card border-border focus:border-white/30 transition-colors"
                />
              </div>
            </div>

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

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className="pl-9 h-11 bg-card border-border focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
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
              className="w-full h-11 text-sm font-medium mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Creating account…
                </span>
              ) : 'Create account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">Already have an account?</span>
            </div>
          </div>

          {/* Login link */}
          <Link
            href="/login"
            className="flex items-center justify-center w-full h-11 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Sign in instead
          </Link>

          {/* Terms note */}
          <p className="text-xs text-center text-muted-foreground mt-5">
            By creating an account you agree to our{' '}
            <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm