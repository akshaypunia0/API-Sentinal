'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authUtils } from '@/lib/apiCalls/authApi'
import { apiCheckerCalls } from '@/lib/apiCalls/apiCheckerCalls'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Send,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react'

/* ─── constants ───────────────────────────────────────────────────────── */

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
type AuthType = 'NONE' | 'BEARER_TOKEN' | 'API_KEY' | 'BASIC_AUTH' | 'CUSTOM_HEADER'

const METHOD_STYLES: Record<HttpMethod, { text: string; bg: string; border: string }> = {
  GET: { text: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/20' },
  POST: { text: 'text-blue-400', bg: 'bg-blue-500/8', border: 'border-blue-500/20' },
  PUT: { text: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/20' },
  PATCH: { text: 'text-violet-400', bg: 'bg-violet-500/8', border: 'border-violet-500/20' },
  DELETE: { text: 'text-red-400', bg: 'bg-red-500/8', border: 'border-red-500/20' },
  HEAD: { text: 'text-cyan-400', bg: 'bg-cyan-500/8', border: 'border-cyan-500/20' },
  OPTIONS: { text: 'text-zinc-400', bg: 'bg-zinc-500/8', border: 'border-zinc-500/20' },
}

const METHODS_WITH_BODY: HttpMethod[] = ['POST', 'PUT', 'PATCH']
const DESTRUCTIVE_METHODS: HttpMethod[] = ['POST', 'PUT', 'PATCH', 'DELETE']

const AUTH_OPTIONS: { value: AuthType; dot: string; label: string }[] = [
  { value: 'NONE', dot: 'bg-zinc-600', label: 'No Auth' },
  { value: 'BEARER_TOKEN', dot: 'bg-blue-400', label: 'Bearer Token' },
  { value: 'API_KEY', dot: 'bg-violet-400', label: 'API Key' },
  { value: 'BASIC_AUTH', dot: 'bg-amber-400', label: 'Basic Auth' },
  { value: 'CUSTOM_HEADER', dot: 'bg-cyan-400', label: 'Custom Header' },
]

const inputCls =
  'h-10 bg-[#181818] border-[#2a2a2a] text-white text-[13px] placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-500 rounded-lg transition-colors'

/* ─── tiny helpers ────────────────────────────────────────────────────── */

const FL = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-zinc-400 mb-1.5 select-none">
    {children}
    {req && <span className="text-zinc-500 ml-0.5 font-normal normal-case tracking-normal"> *</span>}
  </p>
)

const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-500 whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-[#2a2a2a]" />
  </div>
)

/** Pretty-print JSON; if it fails, return raw string */
const prettyJson = (val: any): string => {
  if (typeof val === 'string') {
    try { return JSON.stringify(JSON.parse(val), null, 2) } catch { return val }
  }
  try { return JSON.stringify(val, null, 2) } catch { return String(val) }
}

/** Syntax-highlighted JSON renderer */
type ColorTheme = {
  key: string
  string: string
  number: string
  boolean: string
  null: string
  punctuation: string
}

const HEADER_THEME: ColorTheme = {
  key: 'text-cyan-400',
  string: 'text-emerald-300',
  number: 'text-amber-300',
  boolean: 'text-violet-400',
  null: 'text-zinc-500',
  punctuation: 'text-zinc-500',
}

const BODY_THEME: ColorTheme = {
  key: 'text-sky-400',
  string: 'text-green-300',
  number: 'text-orange-300',
  boolean: 'text-purple-400',
  null: 'text-zinc-500',
  punctuation: 'text-zinc-500',
}

const SyntaxJson = ({ data, theme }: { data: any; theme: ColorTheme }) => {
  const json = prettyJson(data)

  // Tokenize the JSON string with a regex
  const tokenRegex = /("(?:\\.|[^"\\])*")\s*:|"(?:\\.|[^"\\])*"|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}[\]:,]/g

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tokenRegex.exec(json)) !== null) {
    // Add any whitespace/text between tokens
    if (match.index > lastIndex) {
      parts.push(json.slice(lastIndex, match.index))
    }

    const token = match[0]

    // Key (captured group 1 means it's followed by ':')
    if (match[1]) {
      parts.push(
        <span key={`k-${match.index}`} className={theme.key}>{match[1]}</span>
      )
      // Add the colon
      parts.push(
        <span key={`c-${match.index}`} className={theme.punctuation}>:</span>
      )
    } else if (token.startsWith('"')) {
      // String value
      parts.push(
        <span key={`s-${match.index}`} className={theme.string}>{token}</span>
      )
    } else if (token === 'true' || token === 'false') {
      parts.push(
        <span key={`b-${match.index}`} className={theme.boolean}>{token}</span>
      )
    } else if (token === 'null') {
      parts.push(
        <span key={`n-${match.index}`} className={theme.null}>{token}</span>
      )
    } else if (/^-?\d/.test(token)) {
      parts.push(
        <span key={`d-${match.index}`} className={theme.number}>{token}</span>
      )
    } else {
      // Punctuation: { } [ ] , :
      parts.push(
        <span key={`p-${match.index}`} className={theme.punctuation}>{token}</span>
      )
    }

    lastIndex = match.index + token.length
  }

  // Add remaining text
  if (lastIndex < json.length) {
    parts.push(json.slice(lastIndex))
  }

  return <>{parts}</>
}

/** Status code color */
const statusColor = (code: number) => {
  if (code >= 200 && code < 300) return 'text-emerald-200 bg-emerald-500/10 border-emerald-500/20'
  if (code >= 300 && code < 400) return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  if (code >= 400 && code < 500) return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  return 'text-red-400 bg-red-500/10 border-red-500/20'
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */

interface result {
  status: string | boolean;
  message: string;
  result: CheckApiResponse;

}

interface CheckApiResponse {
  success: string | boolean;
  responseTime: number;
  status: number;
  statusText?: string;
  size: number;
  timestamp: string;
  data: any;
  error?: string;
  headers?: Record<string, string>;
}

export default function CheckApiPage() {
  const router = useRouter()

  /* ── auth gate ─────────────────────────────────────────────── */
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const r = await authUtils.checkAuth()
      setIsAuthenticated(r.success)
      setIsLoading(false)
    }
    check()
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login')
  }, [isAuthenticated, isLoading, router])

  /* ── form state ────────────────────────────────────────────── */
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [authType, setAuthType] = useState<AuthType>('NONE')
  const [authToken, setAuthToken] = useState('')
  const [authHeaderName, setAuthHeaderName] = useState('')
  const [authHeaderValue, setAuthHeaderValue] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [body, setBody] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [warningAcked, setWarningAcked] = useState(false)

  /* ── response state ────────────────────────────────────────── */
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  /* Reset warning ack when method changes */
  useEffect(() => { setWarningAcked(false) }, [method])

  const isDestructive = DESTRUCTIVE_METHODS.includes(method)
  const showBody = METHODS_WITH_BODY.includes(method)
  const canSend = url.trim() !== '' && (!isDestructive || warningAcked)

  /* ── send ──────────────────────────────────────────────────── */
  const handleSend = async () => {
    if (!canSend) return
    setIsChecking(true)
    setResult(null)
    setError(null)

    try {
      const payload: any = {
        url: url.trim(),
        method,
        authType,
      }

      if (authType === 'BEARER_TOKEN') payload.authToken = authToken
      if (authType === 'API_KEY') {
        payload.authHeaderName = authHeaderName
        payload.authToken = authHeaderValue
      }
      if (authType === 'BASIC_AUTH') {
        payload.username = username
        payload.password = password
      }
      if (authType === 'CUSTOM_HEADER') {
        payload.authHeaderName = authHeaderName
        payload.authHeaderValue = authHeaderValue
      }
      if (showBody && body.trim()) payload.body = body.trim()

      const res = await apiCheckerCalls.checkInstantApi(payload)

      if (res.success === false && res.error) {
        setError(res.error)
      } else {
        setResult(res)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsChecking(false)
    }
  }

  /* ── copy helper ───────────────────────────────────────────── */
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  /* ── loading / redirect ────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) return null

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════ */
  const mStyle = METHOD_STYLES[method]

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* ── PAGE HEADER ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#181818] border border-[#2a2a2a] flex items-center justify-center">
          <Zap className="h-5 w-5 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">API Checker</h1>
          <p className="text-muted-foreground text-sm">Instantly test any API endpoint</p>
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* ============================================================
           LEFT PANEL — Request Builder
           ============================================================ */}
        <div className="bg-[#0f0f0f] border border-[#222222] rounded-2xl overflow-hidden">

          {/* Panel header */}
          <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-zinc-400" />
              <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-zinc-400">
                Request Builder
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${mStyle.text} ${mStyle.bg} ${mStyle.border}`}>
              {method}
            </span>
          </div>

          <div className="px-6 py-6 space-y-5">

            {/* ① Method + URL */}
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <div>
                <FL req>Method</FL>
                <Select
                  value={method}
                  onValueChange={(v) => setMethod(v as HttpMethod)}
                >
                  <SelectTrigger className="h-10 bg-[#181818] border-[#2a2a2a] text-[13px] rounded-lg focus:ring-1 focus:ring-zinc-500">
                    <SelectValue>
                      <span className={`font-mono font-bold text-[13px] ${METHOD_STYLES[method].text}`}>
                        {method}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-[#161616] border-[#2a2a2a]">
                    {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as HttpMethod[]).map((m) => (
                      <SelectItem key={m} value={m} className="text-[13px] focus:bg-zinc-800">
                        <span className={`font-mono font-bold ${METHOD_STYLES[m].text}`}>{m}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FL req>Endpoint URL</FL>
                <Input
                  id="api-url"
                  className={`${inputCls} font-mono`}
                  placeholder="https://api.example.com/users"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>

            {/* ② Non-GET Warning */}
            {isDestructive && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl animate-fade-in">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="text-[12px] text-amber-300/90 leading-relaxed">
                      <span className="font-semibold">Warning:</span> This request will be sent directly to the
                      target API using <span className="font-mono font-bold">{method}</span>.
                      Non-GET requests may <span className="font-semibold">modify or delete data</span> on the target server.
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <div
                        onClick={() => setWarningAcked(!warningAcked)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${warningAcked
                          ? 'bg-amber-500 border-amber-500'
                          : 'border-amber-500/40 bg-transparent hover:border-amber-500/60'
                          }`}
                      >
                        {warningAcked && (
                          <Check className="h-3 w-3 text-black" strokeWidth={3} />
                        )}
                      </div>
                      <span className="text-[11px] text-amber-400/70 group-hover:text-amber-400/90 transition-colors">
                        I understand this will send an actual <span className="font-mono font-bold">{method}</span> request
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ③ Auth Type + Auth Fields */}
            <div>
              <Divider label="Authentication" />
              <div className="mt-4 space-y-3">

                <div className={`grid ${authType === 'NONE' ? '' : 'grid-cols-[170px_1fr]'} gap-3 items-start`}>
                  <div>
                    <FL>Auth Type</FL>
                    <Select
                      value={authType}
                      onValueChange={(v) => setAuthType(v as AuthType)}
                    >
                      <SelectTrigger className="h-10 bg-[#181818] border-[#2a2a2a] text-[13px] rounded-lg focus:ring-1 focus:ring-zinc-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#161616] border-[#2a2a2a]">
                        {AUTH_OPTIONS.map(({ value, dot, label }) => (
                          <SelectItem key={value} value={value} className="text-[13px] focus:bg-zinc-800">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Auth credential inputs */}
                  {authType === 'NONE' ? null : (
                    <div>
                      {authType === 'BEARER_TOKEN' && (
                        <div className="space-y-1.5">
                          <FL req>Bearer Token</FL>
                          <div className="relative">
                            <Input
                              id="auth-bearer-token"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              className={`${inputCls} font-mono pr-10 focus-visible:ring-blue-500/40`}
                              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
                              value={authToken}
                              onChange={(e) => setAuthToken(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {authType === 'API_KEY' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <FL req>Header Name</FL>
                            <Input
                              id="auth-api-key-name"
                              className={`${inputCls} font-mono focus-visible:ring-violet-500/40`}
                              placeholder="X-API-Key"
                              value={authHeaderName}
                              onChange={(e) => setAuthHeaderName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FL req>Key Value</FL>
                            <Input
                              id="auth-api-key-value"
                              type="password"
                              autoComplete="new-password"
                              className={`${inputCls} font-mono focus-visible:ring-violet-500/40`}
                              placeholder="sk-••••••••"
                              value={authHeaderValue}
                              onChange={(e) => setAuthHeaderValue(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {authType === 'BASIC_AUTH' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <FL req>Username</FL>
                            <Input
                              id="auth-basic-username"
                              autoComplete="off"
                              className={`${inputCls} focus-visible:ring-amber-500/40`}
                              placeholder="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FL req>Password</FL>
                            <Input
                              id="auth-basic-password"
                              type="password"
                              autoComplete="new-password"
                              className={`${inputCls} focus-visible:ring-amber-500/40`}
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {authType === 'CUSTOM_HEADER' && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <FL req>Header Name</FL>
                            <Input
                              id="auth-custom-header-name"
                              className={`${inputCls} font-mono focus-visible:ring-cyan-500/40`}
                              placeholder="X-Custom-Header"
                              value={authHeaderName}
                              onChange={(e) => setAuthHeaderName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <FL req>Header Value</FL>
                            <Input
                              id="auth-custom-header-value"
                              type="password"
                              autoComplete="new-password"
                              className={`${inputCls} font-mono focus-visible:ring-cyan-500/40`}
                              placeholder="custom-value"
                              value={authHeaderValue}
                              onChange={(e) => setAuthHeaderValue(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ④ Request Body */}
            {showBody && (
              <div className="animate-fade-in">
                <Divider label="Request Body" />
                <div className="mt-4 space-y-1.5">
                  <FL>Body <span className="normal-case tracking-normal font-normal text-zinc-500">(JSON)</span></FL>
                  <Textarea
                    id="request-body"
                    className="min-h-[140px] bg-[#181818] border-[#2a2a2a] text-white text-[13px] font-mono placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-500 rounded-lg transition-colors resize-y"
                    placeholder={`{\n  "key": "value"\n}`}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ⑤ Send Button */}
            <button
              id="send-request-btn"
              type="button"
              disabled={isChecking || !canSend}
              onClick={handleSend}
              className={`w-full h-11 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isChecking
                ? 'bg-zinc-800 text-zinc-400 border border-[#2a2a2a]'
                : 'bg-white text-zinc-950 hover:bg-zinc-100'
                }`}
            >
              {isChecking ? (
                <>
                  <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Sending Request…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </div>

        {/* ============================================================
           RIGHT PANEL — Response Viewer
           ============================================================ */}
        <div className="bg-[#0f0f0f] border border-[#222222] rounded-2xl overflow-hidden flex flex-col">

          {/* Panel header */}
          <div className="px-6 py-4 border-b border-[#1e1e1e] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-zinc-400" />
              <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-zinc-400">
                Response
              </span>
            </div>
            {result && (
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg text-[12px] font-mono font-bold border ${statusColor(result?.result?.status)}`}>
                  {result?.result?.statusText || "-"}
                </span>
                <span className="text-[12px] text-zinc-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {result?.message || "-"}
                </span>
                <span className="text-[12px] text-zinc-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {result?.result?.responseTime || "-"}
                </span>
              </div>
            )}
          </div>

          <div className="px-6 py-6 flex-1 overflow-y-auto">
            {/* Error state */}
            {error && !result && (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                  <XCircle className="h-7 w-7 text-red-400" />
                </div>
                <p className="text-red-400 text-sm font-medium mb-1">Request Failed</p>
                <p className="text-zinc-400 text-xs text-center max-w-sm">{error}</p>
              </div>
            )}

            {/* Result state */}
            {result && (
              <div className="space-y-5 animate-fade-in">

                {/* Status summary row */}
                <div className="flex items-center gap-3 flex-wrap">
                  {(result?.result?.success != false) ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                  )}
                  <span className="text-white text-sm font-medium">
                    {(result?.result?.success != false) ? 'Request Successful' : 'Request Returned Error'}
                  </span>
                </div>

                {/* Response Headers */}
                {result?.result?.headers && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-zinc-400">
                        Response Headers
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(prettyJson(result?.result?.headers), 'headers')}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                        title="Copy headers"
                      >
                        {copiedField === 'headers' ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <pre className="text-[12px] font-mono bg-[#0c0c0c] border border-[#252525] rounded-xl p-4 overflow-x-auto max-h-[200px] overflow-y-auto whitespace-pre-wrap break-all">
                      <SyntaxJson data={result?.result?.headers} theme={HEADER_THEME} />
                    </pre>
                  </div>
                )}

                {/* Response Body */}
                {result?.result?.data !== undefined && result?.result?.data !== null && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-zinc-400">
                        Response Body
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(prettyJson(result?.result?.data), 'body')}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                        title="Copy body"
                      >
                        {copiedField === 'body' ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <pre className="text-[12px] font-mono bg-[#0c0c0c] border border-[#252525] rounded-xl p-4 overflow-x-auto max-h-[400px] overflow-y-auto whitespace-pre-wrap break-all">
                      <SyntaxJson data={result?.result?.data} theme={BODY_THEME} />
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Empty state */}
            {!result && !error && (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-[#181818] border border-[#2a2a2a] flex items-center justify-center mb-5">
                  <Clock className="h-7 w-7 text-zinc-700" />
                </div>
                <p className="text-zinc-400 text-sm font-medium mb-1">No Response Yet</p>
                <p className="text-zinc-500 text-xs text-center max-w-xs">
                  Configure your request and click "Send Request" to see the response here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}