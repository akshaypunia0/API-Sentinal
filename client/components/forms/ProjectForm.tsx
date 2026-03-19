import React, { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

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
    <div className="flex justify-center items-center mt-10">
      <Card className="w-full max-w-lg bg-[#0f0f0f] border border-gray-800 shadow-xl">

        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            {initialData ? "Edit Project" : "Create New Project"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {initialData
              ? "Update your project details"
              : "Add a new API monitoring project"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Project Name</label>
              <Input
                className="bg-[#1a1a1a] border-gray-700 text-white"
                placeholder="Enter project name"
                {...register("name", {
                  required: "Project name is required",
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Description</label>
              <Textarea
                className="bg-[#1a1a1a] border-gray-700 text-white"
                placeholder="Optional description..."
                {...register("description", {
                  maxLength: {
                    value: 200,
                    message: "Max 200 characters allowed",
                  },
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              {isSubmitting
                ? initialData
                  ? "Updating..."
                  : "Creating..."
                : initialData
                  ? "Update Project"
                  : "Create Project"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectForm