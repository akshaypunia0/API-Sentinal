'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  KeyRound,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { passwordResetApi } from '@/lib/apiCalls/passwordResetApi'

const steps = [
  { icon: Mail, text: 'Enter your registered email address' },
  { icon: KeyRound, text: 'We\'ll send a secure reset link to your inbox' },
  { icon: ShieldCheck, text: 'Click the link and set a new password' },
]

function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }

    // Console log the email as requested
    console.log('Forgot password email:', email)

    try {
      const response = await passwordResetApi.forgetPassword(email)
      console.log('Forgot password response:', response)
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Failed to forget password')
    }

    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── LEFT: Branding panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-[#0e0e0e] border-r border-white/6 ">
        {/* Subtle background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-amber-500/3 blur-3xl" />
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
          {/* Security visual card */}
          <div className="glass-card rounded-2xl p-5 max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Account security</p>
                <p className="text-xs text-muted-foreground">Password reset process</p>
              </div>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.text} className="flex items-start gap-3 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 border border-white/10 shrink-0 mt-0.5">
                    <span className="text-xs text-muted-foreground font-medium">{index + 1}</span>
                  </div>
                  <span className="text-muted-foreground leading-relaxed">{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-[1.2] mb-3">
              Forgot your<br />
              <span className="gradient-text">password?</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              No worries — it happens to everyone. We&apos;ll help you get back into your account securely in just a few steps.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map(s => (
              <div key={s.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 border border-white/10 shrink-0">
                  <s.icon className="h-3.5 w-3.5 text-white/60" />
                </div>
                {s.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="relative text-xs text-muted-foreground/60 animate-fade-in">
          © {new Date().getFullYear()} API Sentinel. Your security is our priority.
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

          {/* Back to login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          {!isSubmitted ? (
            <>
              {/* Heading */}
              <div className="mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 mb-5">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-1.5">Reset your password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm font-medium">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="forgot-email"
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

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
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
                      Sending reset link…
                    </span>
                  ) : 'Send reset link'}
                </Button>
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-6">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Check your email</h1>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                We&apos;ve sent a password reset link to{' '}
                <span className="text-foreground font-medium">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>

              <div className="glass-card rounded-xl p-4 text-left mb-6">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Didn&apos;t receive the email?</span> Check your spam folder or make sure you entered the correct email address. The link expires in 15 minutes.
                </p>
              </div>

              <Button
                onClick={() => { setIsSubmitted(false); setEmail('') }}
                variant="outline"
                className="w-full h-11 text-sm font-medium"
              >
                Try a different email
              </Button>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">Remember your password?</span>
            </div>
          </div>

          {/* Login link */}
          <Link
            href="/login"
            className="flex items-center justify-center w-full h-11 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
