"use client"

import React, { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"
type AuthType = "NONE" | "BEARER_TOKEN" | "API_KEY" | "BASIC_AUTH" | "CUSTOM_HEADER"

type ApiFormData = {
  id?: string
  projectId: string
  title: string
  url: string
  method: HttpMethod
  intervalMinutes: 1 | 5 | 10 | 15 | 30 | 60
  expectedStatusCodes: number[]
  isActive: boolean
  authType: AuthType
  authToken?: string
  authHeaderName?: string
  authHeaderValue?: string
  username?: string
  password?: string
  healthCheckUrl?: string
}

type ApiFormProps = {
  initialData?: Partial<ApiFormData> | null
  projectId: string
  onSubmit: (data: ApiFormData) => Promise<void> | void
  setOpen: (open: boolean) => void
}

const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: "text-emerald-400",
  POST: "text-blue-400",
  PUT: "text-amber-400",
  DELETE: "text-red-400",
  PATCH: "text-violet-400",
  HEAD: "text-cyan-400",
  OPTIONS: "text-zinc-400",
}

const ALL_STATUS_CODES = [
  { code: 200, label: "OK", color: "text-emerald-400" },
  { code: 201, label: "Created", color: "text-emerald-400" },
  { code: 204, label: "No Content", color: "text-emerald-400" },
  { code: 301, label: "Moved", color: "text-blue-400" },
  { code: 400, label: "Bad Request", color: "text-amber-400" },
  { code: 401, label: "Unauthorized", color: "text-orange-400" },
  { code: 403, label: "Forbidden", color: "text-orange-400" },
  { code: 404, label: "Not Found", color: "text-red-400" },
  { code: 429, label: "Too Many Req.", color: "text-orange-400" },
  { code: 500, label: "Server Error", color: "text-red-400" },
  { code: 502, label: "Bad Gateway", color: "text-red-400" },
  { code: 503, label: "Unavailable", color: "text-red-400" },
  { code: 504, label: "Gateway Timeout", color: "text-red-400" },
]

const inputCls =
  "h-10 bg-[#181818] border-[#2a2a2a] text-white text-[13px] placeholder:text-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-500 rounded-lg transition-colors"

const FL = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <p className="text-[10px] font-bold tracking-[0.13em] uppercase text-zinc-500 mb-1.5 select-none">
    {children}
    {req && <span className="text-zinc-700 ml-0.5 font-normal normal-case tracking-normal"> *</span>}
  </p>
)

const FE = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-red-400 text-[11px] mt-1 font-medium leading-none">
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className="shrink-0">
        <circle cx="4.5" cy="4.5" r="4" stroke="currentColor" strokeWidth="1" />
        <path d="M4.5 2.5v2M4.5 6h.01" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
      {msg}
    </p>
  ) : null

const Divider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-700 whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-[#1e1e1e]" />
  </div>
)

/* ── Status Codes custom multi-select dropdown ──────────────────────────── */
const StatusCodesDropdown = ({
  selected,
  onChange,
}: {
  selected: number[]
  onChange: (codes: number[]) => void
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const toggle = (code: number) =>
    onChange(selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code])

  const triggerLabel =
    selected.length === 0
      ? "Select codes…"
      : selected.length <= 3
        ? selected.join(", ")
        : `${selected.slice(0, 3).join(", ")} +${selected.length - 3}`

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-10 bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 flex items-center justify-between hover:border-zinc-600 transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-500"
      >
        <span className={`font-mono text-[12px] ${selected.length ? "text-zinc-300" : "text-zinc-700"}`}>
          {triggerLabel}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`text-zinc-600 transition-transform duration-150 shrink-0 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-60 top-[calc(100%+5px)] left-0 w-[270px] bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="p-1.5 grid grid-cols-2 gap-0.5 max-h-[200px] overflow-y-auto">
            {ALL_STATUS_CODES.map(({ code, label, color }) => {
              const checked = selected.includes(code)
              return (
                <label
                  key={code}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors select-none ${checked ? "bg-zinc-800/60" : "hover:bg-zinc-800/30"
                    }`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(code)}
                    className="w-3.5 h-3.5 border-zinc-600 rounded-[4px] data-[state=checked]:bg-zinc-200 data-[state=checked]:border-zinc-200 shrink-0"
                  />
                  <span className={`font-mono font-bold text-[12px] ${color}`}>{code}</span>
                  <span className="text-zinc-600 text-[10px] truncate">{label}</span>
                </label>
              )
            })}
          </div>
          <div className="border-t border-[#2a2a2a] px-3 py-2 flex items-center justify-between">
            <span className="text-[11px] text-zinc-600">
              <span className="text-zinc-400 font-semibold">{selected.length}</span> selected
            </span>
            <button
              type="button"
              onClick={() =>
                onChange(
                  selected.length === ALL_STATUS_CODES.length
                    ? []
                    : ALL_STATUS_CODES.map((s) => s.code)
                )
              }
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {selected.length === ALL_STATUS_CODES.length ? "Clear all" : "Select all"}
            </button>
          </div>
        </div>
      )}

      {/* Selected tags below trigger */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map((code) => {
            const meta = ALL_STATUS_CODES.find((s) => s.code === code)
            return (
              <span
                key={code}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/60 border border-zinc-700/40 text-[11px] font-mono font-semibold ${meta?.color || "text-zinc-400"}`}
              >
                {code}
                <button
                  type="button"
                  onClick={() => onChange(selected.filter((c) => c !== code))}
                  className="text-zinc-600 hover:text-zinc-300 leading-none ml-0.5"
                >
                  ×
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Auth credential fields ─────────────────────────────────────────────── */
const AuthFields = ({
  authType,
  register,
  errors,
}: {
  authType: AuthType
  register: any
  errors: any
}) => {
  if (authType === "NONE") return null

  const accentMap: Record<string, string> = {
    BEARER_TOKEN: "focus-visible:ring-blue-500/40",
    API_KEY: "focus-visible:ring-violet-500/40",
    BASIC_AUTH: "focus-visible:ring-amber-500/40",
    CUSTOM_HEADER: "focus-visible:ring-cyan-500/40",
  }
  const accent = accentMap[authType] || ""

  if (authType === "BEARER_TOKEN") {
    return (
      <div className="space-y-1.5">
        <FL req>Bearer Token</FL>
        <Input
          type="password"
          autoComplete="new-password"
          className={`${inputCls} ${accent} font-mono`}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
          {...register("authToken", { required: "Bearer token is required" })}
        />
        <FE msg={errors.authToken?.message} />
      </div>
    )
  }

  if (authType === "BASIC_AUTH") {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FL req>Username</FL>
          <Input
            className={`${inputCls} ${accent}`}
            autoComplete="off"
            placeholder="username"
            {...register("username", { required: "Username required" })}
          />
          <FE msg={errors.username?.message} />
        </div>
        <div className="space-y-1.5">
          <FL req>Password</FL>
          <Input
            type="password"
            autoComplete="new-password"
            className={`${inputCls} ${accent}`}
            placeholder="••••••••"
            {...register("password", { required: "Password required" })}
          />
          <FE msg={errors.password?.message} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <FL req>Header Name</FL>
        <Input
          className={`${inputCls} ${accent} font-mono`}
          autoComplete="off"
          placeholder={authType === "API_KEY" ? "X-API-Key" : "X-Custom-Header"}
          {...register("authHeaderName", { required: "Header name required" })}
        />
        <FE msg={errors.authHeaderName?.message} />
      </div>
      <div className="space-y-1.5">
        <FL req>{authType === "API_KEY" ? "Key Value" : "Header Value"}</FL>
        <Input
          type="password"
          autoComplete="new-password"
          className={`${inputCls} ${accent} font-mono`}
          placeholder={authType === "API_KEY" ? "sk-••••••••" : "custom-value"}
          {...register("authHeaderValue", { required: "Value required" })}
        />
        <FE msg={errors.authHeaderValue?.message} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const ApiRegistrationForm: React.FC<ApiFormProps> = ({
  initialData,
  projectId,
  onSubmit,
  setOpen,
}) => {
  const [showHealthCheck, setShowHealthCheck] = useState(false)
  const [currentAuthType, setCurrentAuthType] = useState<AuthType>("NONE")

  const isEditMode = !!initialData?.id

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApiFormData>({
    defaultValues: {
      projectId,
      title: "",
      url: "",
      method: "GET",
      intervalMinutes: 5,
      expectedStatusCodes: [200],
      isActive: true,
      authType: "NONE",
    },
  })

  const watchedMethod = watch("method")
  const watchedAuthType = watch("authType")
  const isActive = watch("isActive")
  const codes = watch("expectedStatusCodes") || []

  useEffect(() => { setShowHealthCheck(watchedMethod !== "GET") }, [watchedMethod])
  useEffect(() => { setCurrentAuthType(watchedAuthType) }, [watchedAuthType])

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        projectId,
        title: initialData.title || "",
        url: initialData.url || "",
        method: initialData.method || "GET",
        intervalMinutes: (initialData.intervalMinutes as any) || 5,
        expectedStatusCodes: initialData.expectedStatusCodes || [200],
        isActive: initialData.isActive ?? true,
        authType: (initialData.authType as any) || "NONE",
        authToken: initialData.authToken || "",
        authHeaderName: initialData.authHeaderName || "",
        authHeaderValue: initialData.authHeaderValue || "",
        username: initialData.username || "",
        password: initialData.password || "",
        healthCheckUrl: initialData.healthCheckUrl || "",
      })
      setTimeout(() => {
        setShowHealthCheck((initialData.method || "GET") !== "GET")
        setCurrentAuthType((initialData.authType as any) || "NONE")
      }, 0)
    }
  }, [initialData, projectId, reset])

  const handleFormSubmit = async (data: ApiFormData) => {
    await onSubmit(data)
    setOpen(false)
    if (!isEditMode) {
      reset({
        projectId,
        title: "",
        url: "",
        method: "GET",
        intervalMinutes: 5,
        expectedStatusCodes: [200],
        isActive: true,
        authType: "NONE",
      })
    }
  }

  return (
    <div className="w-full max-h-[85vh] flex flex-col bg-[#111111] border border-[#1e1e1e] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex px-8 py-4 border-b border-[#1a1a1a] justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-400">
              <path d="M1.5 3.5h11M1.5 7h7M1.5 10.5h4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="11.5" cy="10" r="2" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </div>
          <span className="flex items-center  text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-600">
            {isEditMode ? "Edit endpoint" : "New endpoint"}
          </span>
        </div>
        <h2 className="flex items-center text-[20px] font-semibold text-white tracking-tight leading-none">
          {isEditMode ? "Edit API Endpoint" : "Register New API"}
        </h2>
        {/* <p className="text-[12px] text-zinc-600 leading-relaxed">
            {isEditMode
              ? "Update your monitoring configuration"
              : "Configure an endpoint to monitor for uptime and performance"}
          </p> */}
      </div>

      {/* ── FORM BODY ────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off" className="flex flex-col overflow-hidden">
        <div className="px-8 py-7 space-y-5 overflow-y-auto">

          {/* ① API Title */}
          <div>
            <FL req>API Title</FL>
            <Input
              className={inputCls}
              placeholder="e.g., User Authentication API"
              {...register("title", {
                required: "API title is required",
                minLength: { value: 3, message: "Minimum 3 characters required" },
                maxLength: { value: 100, message: "Maximum 100 characters allowed" },
              })}
            />
            <FE msg={errors.title?.message} />
          </div>

          {/* ② Method (left) + Endpoint URL (right) */}
          <div className="grid grid-cols-[160px_1fr] gap-3">
            <div>
              <FL req>Method</FL>
              <Select
                onValueChange={(v) => setValue("method", v as HttpMethod)}
                defaultValue={initialData?.method || "GET"}
              >
                <SelectTrigger className="h-10 bg-[#181818] border-[#2a2a2a] text-[13px] rounded-lg focus:ring-1 focus:ring-zinc-500">
                  <SelectValue>
                    <span className={`font-mono font-bold text-[13px] ${METHOD_STYLES[watchedMethod] || "text-white"}`}>
                      {watchedMethod || "GET"}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#161616] border-[#2a2a2a]">
                  {(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"] as HttpMethod[]).map((m) => (
                    <SelectItem key={m} value={m} className="text-[13px] focus:bg-zinc-800">
                      <span className={`font-mono font-bold ${METHOD_STYLES[m]}`}>{m}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <FL req>Endpoint URL</FL>
              <Input
                className={`${inputCls} font-mono`}
                autoComplete="off"
                placeholder="https://api.example.com/users"
                {...register("url", {
                  required: "API URL is required",
                  pattern: { value: /^https?:\/\/[^\s$.?#].[^\s]*$/i, message: "Please enter a valid URL" },
                })}
              />
              <FE msg={errors.url?.message} />
            </div>
          </div>

          {/* ③ Health Check URL — only for non-GET */}
          {showHealthCheck && (
            <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-amber-400 shrink-0">
                  <path d="M6 1L1 11h10L6 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M6 5v2.5M6 9.5h.01" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
                <span className="text-[9px] font-bold tracking-[0.13em] uppercase text-amber-400/70">
                  Health check required for non-GET methods
                </span>
              </div>
              <FL req>Health Check URL</FL>
              <Input
                className={`${inputCls} font-mono border-amber-500/20 focus-visible:ring-amber-500/40`}
                autoComplete="off"
                placeholder="https://api.example.com/health"
                {...register("healthCheckUrl", {
                  required: "Health check URL required for non-GET methods",
                  pattern: { value: /^https?:\/\/[^\s$.?#].[^\s]*$/i, message: "Please enter a valid URL" },
                })}
              />
              <FE msg={errors.healthCheckUrl?.message} />
            </div>
          )}

          {/* ④ Interval (left) + Status Codes (middle) + Active toggle (right) */}
          <div className="grid grid-cols-3 gap-3 items-start">

            {/* Check Interval */}
            <div>
              <FL>Check Interval</FL>
              <Select
                onValueChange={(v) => setValue("intervalMinutes", parseInt(v) as any)}
                defaultValue={String(initialData?.intervalMinutes || 5)}
              >
                <SelectTrigger className="h-10 bg-[#181818] border-[#2a2a2a] text-[13px] rounded-lg focus:ring-1 focus:ring-zinc-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#161616] border-[#2a2a2a]">
                  {[
                    ["1", "Every 1 min"],
                    ["5", "Every 5 min"],
                    ["10", "Every 10 min"],
                    ["15", "Every 15 min"],
                    ["30", "Every 30 min"],
                    ["60", "Every hour"],
                  ].map(([v, l]) => (
                    <SelectItem key={v} value={v} className="text-[13px] focus:bg-zinc-800">{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expected Status Codes */}
            <div>
              <FL>Status Codes</FL>
              <StatusCodesDropdown
                selected={codes}
                onChange={(c) => setValue("expectedStatusCodes", c)}
              />
            </div>

            {/* Monitor Active toggle — plain button, no nested interactive element */}
            <div>
              <FL>Monitor Status</FL>
              <button
                type="button"
                onClick={() => setValue("isActive", !isActive)}
                className={`w-full h-10 flex items-center justify-between px-3 rounded-lg border transition-all select-none ${isActive
                  ? "bg-emerald-500/8 border-emerald-500/20 hover:bg-emerald-500/12"
                  : "bg-[#181818] border-[#2a2a2a] hover:border-zinc-600"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 transition-all ${isActive
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                      : "bg-zinc-700"
                      }`}
                  />
                  <span className={`text-[12px] font-semibold ${isActive ? "text-emerald-400" : "text-zinc-600"}`}>
                    {isActive ? "Active" : "Paused"}
                  </span>
                </div>
                {/* Visual-only switch — pointer-events-none so outer button handles click */}
                <div
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${isActive ? "bg-emerald-500" : "bg-zinc-700"
                    }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-[18px]" : "translate-x-[3px]"
                      }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* ⑤ Auth Type (left) + Auth credential inputs (right) */}
          <div>
            <Divider label="Authentication" />
            <div className="mt-4 grid grid-cols-[190px_1fr] gap-3 items-start">

              {/* Auth Type */}
              <div>
                <FL>Auth Type</FL>
                <Select
                  onValueChange={(v) => setValue("authType", v as AuthType)}
                  defaultValue={initialData?.authType || "NONE"}
                >
                  <SelectTrigger className="h-10 bg-[#181818] border-[#2a2a2a] text-[13px] rounded-lg focus:ring-1 focus:ring-zinc-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#161616] border-[#2a2a2a]">
                    {[
                      { v: "NONE", dot: "bg-zinc-600", label: "No Auth" },
                      { v: "BEARER_TOKEN", dot: "bg-blue-400", label: "Bearer Token" },
                      { v: "API_KEY", dot: "bg-violet-400", label: "API Key" },
                      { v: "BASIC_AUTH", dot: "bg-amber-400", label: "Basic Auth" },
                      { v: "CUSTOM_HEADER", dot: "bg-cyan-400", label: "Custom Header" },
                    ].map(({ v, dot, label }) => (
                      <SelectItem key={v} value={v} className="text-[13px] focus:bg-zinc-800">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Credential inputs — right side, vertically aligned with auth dropdown */}
              <div>
                {currentAuthType === "NONE" ? (
                  <div>
                    {/* Invisible label spacer to align with dropdown */}
                    <p className="text-[10px] mb-1.5 opacity-0 select-none">_</p>
                    <div className="h-10 flex items-center px-3 rounded-lg border border-dashed border-[#222]">
                      <span className="text-[11px] text-zinc-700">No credentials required</span>
                    </div>
                  </div>
                ) : (
                  <AuthFields authType={currentAuthType} register={register} errors={errors} />
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <div className="px-8 py-4 border-t border-[#1a1a1a] bg-[#0d0d0d] flex items-center gap-4 shrink-0">
          <p className="text-[11px] text-zinc-700 hidden sm:block flex-1">
            {isEditMode
              ? "Changes apply on the next check cycle."
              : "Monitoring begins immediately after registration."}
          </p>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 px-5 bg-transparent border border-[#2a2a2a] text-zinc-400 hover:bg-[#1c1c1c] hover:text-white hover:border-zinc-600 rounded-lg text-[13px] font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-6 bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-[13px] rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 min-w-[150px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  {isEditMode ? "Saving…" : "Registering…"}
                </>
              ) : (
                isEditMode ? "Save Changes" : "Register Endpoint"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ApiRegistrationForm