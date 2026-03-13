'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react'

/* ─────────── tiny counter hook ─────────── */
function useCounter(target: number, duration = 1800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return value
}

/* ─────────── stat card data ─────────── */
const stats = [
  { label: 'APIs Monitored', value: 12000, suffix: '+' },
  { label: 'Uptime SLA',     value: 99,    suffix: '.9%' },
  { label: 'Avg Alert Time', value: 8,     suffix: 's'   },
  { label: 'Global Regions', value: 14,    suffix: '+'   },
]

/* ─────────── feature cards ─────────── */
const features = [
  {
    icon: Activity,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    title: 'Real-Time Monitoring',
    description:
      'Track every API endpoint continuously. Get instant insights with response-time graphs and uptime charts updated every second.',
  },
  {
    icon: Bell,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/10',
    title: 'Smart Alerting',
    description:
      'Receive alerts via Email, SMS, or Slack the moment an API goes down or degrades. Configurable thresholds keep noise low.',
  },
  {
    icon: BarChart3,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/10',
    title: 'Deep Analytics',
    description:
      'Visualise response-time percentiles, error rates, and traffic trends over time. Export reports for performance reviews.',
  },
  {
    icon: Shield,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    title: 'Security Checks',
    description:
      'Audit SSL certificates, detect unexpected status-code changes, and receive warnings before credentials or certs expire.',
  },
  {
    icon: Globe,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-400/10',
    title: 'Multi-Region Checks',
    description:
      'Run checks from 14 global locations to detect regional outages before your users notice anything is wrong.',
  },
  {
    icon: Zap,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-400/10',
    title: 'Instant API Tester',
    description:
      'Test any endpoint on demand — set headers, method, and body. See status codes, response time, and full response body instantly.',
  },
]

/* ─────────── how it works ─────────── */
const steps = [
  {
    num: '01',
    title: 'Create a Project',
    description: 'Group your APIs into logical projects for clean organisation and team collaboration.',
  },
  {
    num: '02',
    title: 'Add Your APIs',
    description: 'Paste your endpoint URLs, choose a check interval, and set threshold values. Done in seconds.',
  },
  {
    num: '03',
    title: 'Get Alerted Instantly',
    description: 'Sit back. API Sentinel watches your endpoints 24/7 and pings you the moment something breaks.',
  },
]

/* ─────────── terminal mock lines ─────────── */
const terminalLines = [
  { delay: 0,    color: 'text-gray-500', text: '$ sentinel watch --project e-commerce' },
  { delay: 600,  color: 'text-emerald-400', text: '✓  GET /api/products      200  142ms' },
  { delay: 1100, color: 'text-emerald-400', text: '✓  GET /api/cart           200   98ms' },
  { delay: 1600, color: 'text-red-400',     text: '✗  POST /api/checkout     503  timeout' },
  { delay: 2000, color: 'text-amber-400',   text: '⚑  Alert sent → slack #ops-alerts' },
  { delay: 2500, color: 'text-gray-500',    text: '↺  Retrying in 60s…' },
]

function TerminalMock() {
  const [visible, setVisible] = useState<number[]>([])
  useEffect(() => {
    terminalLines.forEach((l, i) => {
      setTimeout(() => setVisible(v => [...v, i]), l.delay)
    })
  }, [])
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5 font-mono text-sm shadow-2xl">
      <div className="flex gap-1.5 mb-4">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-amber-500/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
      </div>
      <div className="space-y-1.5">
        {terminalLines.map((l, i) => (
          <div
            key={i}
            className={`transition-all duration-300 ${l.color} ${visible.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            {l.text}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────── stat counter row ─────────── */
function StatCounter({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const count = useCounter(inView ? value : 0)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold gradient-text tabular-nums">
        {count}{suffix}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

/* ─────────── main component ─────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] glass-card-subtle">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">API Sentinel</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white text-black px-4 py-1.5 text-sm font-medium transition-all hover:bg-white/90 hover:shadow-lg"
            >
              Get started <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Glow orbs */}
        <div className="hero-orb w-[600px] h-[400px] bg-white/[0.03] -top-20 -left-40" />
        <div className="hero-orb w-[500px] h-[400px] bg-blue-500/[0.04] top-10 right-0" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span>Trusted by 1,200+ engineering teams worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Monitor your APIs
            <br />
            <span className="gradient-text">before they fail.</span>
          </h1>

          {/* Subtext */}
          <p className="animate-slide-up animation-delay-100 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            API Sentinel continuously watches every endpoint, alerts you in seconds, and gives you deep performance analytics — so you fix problems before your users ever notice.
          </p>

          {/* CTA row */}
          <div className="animate-slide-up animation-delay-200 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-7 py-3 text-base font-semibold transition-all hover:bg-white/90 hover:shadow-2xl hover:-translate-y-0.5"
            >
              Start monitoring free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3 text-base font-medium text-foreground transition-all hover:bg-white/10 hover:-translate-y-0.5"
            >
              Sign in to dashboard
            </Link>
          </div>

          {/* Trust chips */}
          <div className="animate-slide-up animation-delay-300 flex flex-wrap items-center justify-center gap-4 mt-10 text-xs text-muted-foreground">
            {['No credit card required', 'Free plan available', 'Cancel anytime'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Terminal hero visual */}
        <div className="animate-slide-up animation-delay-400 mx-auto mt-20 max-w-2xl">
          <TerminalMock />
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="py-20 px-6 border-y border-white/[0.06]">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map(s => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Features</p>
            <h2 className="text-4xl font-bold mb-4">Everything you need to stay in control</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete observability suite for your APIs — from first request to real-time incident response.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-card rounded-xl p-6 card-hover animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              >
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${f.iconBg} mb-4`}>
                  <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Process</p>
            <h2 className="text-4xl font-bold mb-4">Up and running in 3 steps</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              No complex setup. No DevOps expertise needed. Start monitoring in under 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className="text-5xl font-black text-white/5 mb-4">{s.num}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATUS STRIP ── */}
      <section className="py-16 px-6 border-t border-white/[0.06]">
        <div className="mx-auto max-w-5xl">
          <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-lg">All systems operational</p>
                <p className="text-sm text-muted-foreground">Live status across 14 monitoring regions</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-muted-foreground">Response checker</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-muted-foreground">Alert system</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-muted-foreground">Analytics pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="py-28 px-6 relative overflow-hidden border-t border-white/[0.06]">
        <div className="hero-orb w-[500px] h-[300px] bg-white/[0.025] top-0 left-1/2 -translate-x-1/2" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Clock className="h-12 w-12 text-white/20 mx-auto mb-6 animate-float" />
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Stop finding out about<br />
            <span className="gradient-text">outages from your users.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join thousands of teams that trust API Sentinel to protect their APIs — and their reputation.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-8 py-3.5 text-base font-semibold transition-all hover:bg-white/90 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Start for free today
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="font-medium text-foreground">API Sentinel</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Status</a>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
