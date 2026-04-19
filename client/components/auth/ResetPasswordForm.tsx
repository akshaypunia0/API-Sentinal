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
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import { passwordResetApi } from '@/lib/apiCalls/passwordResetApi'
import { useSearchParams } from 'next/navigation'
import { log } from 'console'

const requirements = [
  'At least 8 characters long',
  'Contains at least one uppercase letter',
  'Contains at least one number',
  'Contains at least one special character',
]

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  console.log("Token: ", token);


  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(newPassword)

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength] || ''
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][passwordStrength] || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    // Console log the new password as requested
    console.log('New password:', newPassword)
    console.log('Confirm password:', confirmPassword)

    try {
      const response = await passwordResetApi.resetPassword(token, newPassword)
      console.log('Reset password response:', response)
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Failed to reset password')
      setIsLoading(false)
      return
    }

    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── LEFT: Branding panel ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-[#0e0e0e] border-r border-white/6">
        {/* Subtle background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-500/3 blur-3xl" />
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
          {/* Security tips card */}
          <div className="glass-card rounded-2xl p-5 max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Password requirements</p>
                <p className="text-xs text-muted-foreground">Create a strong, unique password</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {requirements.map((req) => (
                <div key={req} className="flex items-center gap-2.5 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-[1.2] mb-3">
              Set a new<br />
              <span className="gradient-text">secure password.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Choose a strong password that you haven&apos;t used before. A good password is long, unique, and hard to guess.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: Lock, text: 'Your password is encrypted end-to-end' },
              { icon: ShieldCheck, text: 'We never store plain-text passwords' },
              { icon: CheckCircle, text: 'Session tokens are refreshed after reset' },
            ].map(s => (
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
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-1.5">Create new password</h1>
                <p className="text-muted-foreground text-sm">
                  Your new password must be different from your previously used password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">New password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-9 pr-10 h-11 bg-card border-border focus:border-white/30 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {newPassword.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${level <= passwordStrength ? strengthColor : 'bg-white/10'
                              }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength <= 1 ? 'text-red-400' :
                        passwordStrength === 2 ? 'text-amber-400' :
                          passwordStrength === 3 ? 'text-blue-400' :
                            'text-emerald-400'
                        }`}>
                        {strengthLabel} password
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm new password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-9 pr-10 h-11 bg-card border-border focus:border-white/30 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-xs text-emerald-400">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                          <span className="text-xs text-red-400">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
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
                      Resetting password…
                    </span>
                  ) : 'Reset password'}
                </Button>
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-6">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Password updated</h1>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>

              <Link href="/login">
                <Button className="w-full h-11 text-sm font-medium">
                  Back to sign in
                </Button>
              </Link>
            </div>
          )}

          {/* Divider */}
          {!isSubmitted && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
