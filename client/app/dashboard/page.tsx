'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Globe, FolderOpen, Activity } from 'lucide-react'
import { authUtils } from '@/lib/apiCalls/authApi'
import { projectApiCalls } from '@/lib/apiCalls/projectApis'
import { apimanagementApiCalls } from '@/lib/apiCalls/apiManagementCalls'
import DashboardCard from '@/components/dashboard/Card'

export default function DashboardPage() {

  interface ApiData {
  id: string;
  name: string;
  lastResponseTimeMs: number;
}



  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()


  //apiData states
  const [allProjects, setAllProjects] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [allApis, setAllApis] = useState<ApiData[]>([])

  const [averageResponse, setAverageResponse] = useState(0)


  const getAllProjects = async () => {
    const response = await projectApiCalls.getAllProjects(page, limit)
    setAllProjects(response.projects)
  }

  const getAllApis = async () => {
    const response = await apimanagementApiCalls.getAllApis()
    setAllApis(response.totalApis)
  }

  useEffect(() => {
    getAllProjects();
    getAllApis();
  }, [])

  useEffect(() => {
    if (allApis.length > 0) {
      const sum = allApis.reduce((acc, apiData) => acc + apiData.lastResponseTimeMs, 0);
      setAverageResponse(sum / allApis.length);
    } else {
      setAverageResponse(0);
    }
  }, [allApis])

  console.log("All projects: ", allProjects);
  console.log("All apis: ", allApis);
  console.log("Average responsee time: ", averageResponse);
  



  // useEffect(() => {
  //   // Only check auth when accessing dashboard - this calls /auth/me
  //   const checkAuthentication = async () => {
  //     const result = await authUtils.checkAuth()
  //     setIsAuthenticated(result.success)
  //     setIsLoading(false)
  //   }

  //   checkAuthentication()
  // }, [])

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push('/login')
  //   }
  // }, [isAuthenticated, isLoading, router])

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
  //         <p className="mt-2 text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   )
  // }

  // if (!isAuthenticated) {
  //   return null // Will redirect
  // }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to API Sentinel. Monitor your APIs with ease.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Projects" data={allProjects.length} icon={<FolderOpen />} />
        <DashboardCard title="Total APIs" data={allApis.length} icon={<Globe />} />
        <DashboardCard title="Average Response time" data={Number((averageResponse).toFixed(1))} icon={<Activity />} />
        <DashboardCard title="Alerts" data={3} icon={<BarChart3 />} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with API Sentinel</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button>
            <FolderOpen className="mr-2 h-4 w-4" />
            Create Project
          </Button>
          <Button variant="outline">
            <Globe className="mr-2 h-4 w-4" />
            Add API
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest API checks and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">API /api/users is up</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">API /api/orders is down</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New project created: E-commerce</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}