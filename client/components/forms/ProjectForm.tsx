import React, { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// ✅ Form Data Type
type ProjectFormData = {
  name: string
  description?: string
}

// ✅ Props Type
type ProjectFormProps = {
  initialData?: ProjectFormData
  onSubmit: (data: ProjectFormData) => Promise<void> | void
  setOpen: (open: boolean) => void
}

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

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  setOpen
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>() // ✅ Type added

  // Prefill (Edit Mode)
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
      })
    }
  }, [initialData, reset])

  const handleFormSubmit = async (data: ProjectFormData) => {
    await onSubmit(data)
    setOpen(false)
    if (!initialData) reset()
  }

  return (
    <div className="w-full max-h-[85vh] flex flex-col bg-[#111111] border border-[#1e1e1e] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex px-8 py-4 border-b border-[#1a1a1a] justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-400">
              <path d="M2 3h10v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 1h4v2H5V1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="flex items-center text-[9px] font-bold tracking-[0.15em] uppercase text-zinc-600">
            {initialData ? "Edit project" : "New project"}
          </span>
        </div>
        <h2 className="flex items-center text-[20px] font-semibold text-white tracking-tight leading-none">
          {initialData ? "Edit Project" : "Create New Project"}
        </h2>
      </div>

      {/* ── FORM BODY ────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off" className="flex flex-col overflow-hidden">
        <div className="px-8 py-7 space-y-5 overflow-y-auto">

          {/* ① Project Name */}
          <div>
            <FL req>Project Name</FL>
            <Input
              className={inputCls}
              placeholder="e.g., E-commerce API Suite"
              {...register("name", {
                required: "Project name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
              })}
            />
            <FE msg={errors.name?.message} />
          </div>

          {/* ② Description */}
          <div>
            <FL>Description</FL>
            <Textarea
              className="bg-[#181818] border-[#2a2a2a] text-white text-[13px] placeholder:text-zinc-700 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-500 rounded-lg transition-colors min-h-[100px] resize-none"
              placeholder="Optional description for your project..."
              {...register("description", {
                maxLength: {
                  value: 200,
                  message: "Max 200 characters allowed",
                },
              })}
            />
            <FE msg={errors.description?.message} />
          </div>

        </div>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <div className="px-8 py-4 border-t border-[#1a1a1a] bg-[#0d0d0d] flex items-center gap-4 shrink-0">
          <p className="text-[11px] text-zinc-700 hidden sm:block flex-1">
            {initialData
              ? "Update your project details."
              : "Create a new project to start monitoring APIs."}
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
                  {initialData ? "Updating…" : "Creating…"}
                </>
              ) : (
                initialData ? "Update Project" : "Create Project"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm