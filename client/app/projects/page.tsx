'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderOpen, Plus } from 'lucide-react'
import { authUtils } from '@/lib/apiCalls/authApi'
import ProjectTable from '@/components/projects/Table'
import { projectApiCalls } from '@/lib/apiCalls/projectApis'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ProjectForm from '@/components/forms/ProjectForm'
import PaginationComponent from '@/components/other/Pagination'



export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [allProjects, setAllProjects] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const router = useRouter()

  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await authUtils.checkAuth()
      setIsAuthenticated(result.success)
      setIsLoading(false)
    }

    checkAuthentication()
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // API call
  const fetchAllProjects = async () => {
    const response = await projectApiCalls.getAllProjects(page, limit)
    setAllProjects(response.projects)
  }

  const deleteProject = async (projectId: string) => {
    await projectApiCalls.deleteProject(projectId);
    fetchAllProjects()
  }

  const View = async (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllProjects()
    }
  }, [isAuthenticated, page, limit])



  const handleSubmitProject = async (data: object) => {
    await projectApiCalls.createProject(data)
    fetchAllProjects()
  }




  // Conditional rendering AFTER hooks
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  console.log("All projects: ", allProjects);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your API monitoring projects</p>
        </div>
        <Button
          onClick={() => {
            setSelectedProject(null)
            setOpen(true)
          }}
          className=" bg-gray-200 text-black hover:bg-white transition-all shadow-md hover:shadow-xl hover:-translate-y-0.2 active:translate-y-0 hover:border-gray-100 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
          Create Project
        </Button>
      </div>

      {allProjects.length > 0 ? <div className="bg-card p-3 rounded-2xl border border-border">
        <ProjectTable allProjects={allProjects} deleteProject={deleteProject} view={View} />
      </div>
        :
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet?</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first project to start monitoring your APIs
            </p>
            <Button
              onClick={() => {
                setSelectedProject(null)
                setOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>}

        <PaginationComponent />


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="fixed! inset-0! top-0! left-0! translate-x-0! translate-y-0! max-w-none! w-auto! rounded-none! bg-black/60 backdrop-blur-sm border-none shadow-none ring-0 flex items-center justify-center overflow-y-auto p-6 sm:p-10"
          showCloseButton={false}
        >
          <DialogTitle className="hidden" />
          <DialogHeader className="hidden" />
          <div className="w-full max-w-[520px] relative">
            {/* Custom close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#2a2a2a] transition-colors shadow-lg"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <ProjectForm
              initialData={selectedProject}
              onSubmit={handleSubmitProject}
              setOpen={setOpen}
            />
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
}