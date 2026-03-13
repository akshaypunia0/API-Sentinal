'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderOpen, Plus } from 'lucide-react'
import { authUtils } from '@/lib/apiCalls/authApi'
import ProjectTable from '@/components/projects/Table'
import { projectApiCalls } from '@/lib/apiCalls/projectApis'



export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [allProjects, setAllProjects] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>}




    </div>
  )
}