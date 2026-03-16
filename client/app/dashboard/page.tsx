'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Globe, FolderOpen, Activity } from 'lucide-react'
import { authUtils } from '@/lib/apiCalls/authApi'
import { projectApiCalls } from '@/lib/apiCalls/projectApis'
import { apimanagementApiCalls } from '@/lib/apiCalls/apiManagementCalls'
import DashboardCard from '@/components/dashboard/Card'
import LoadigPage from '@/components/other/Loadig'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts"

export default function DashboardPage() {

  interface ApiData {
    id: string
    name: string
    lastResponseTimeMs: number
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  const [allProjects, setAllProjects] = useState<any[]>([])
  const [page] = useState(1)
  const [limit] = useState(10)

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

    getAllProjects()
    getAllApis()

    const interval = setInterval(() => {
      getAllApis()
    }, 21000)

    return () => clearInterval(interval)

  }, [])

  useEffect(() => {

    if (allApis.length > 0) {
      const sum = allApis.reduce((acc, apiData) => acc + apiData.lastResponseTimeMs, 0)
      setAverageResponse(sum / allApis.length)
    } else {
      setAverageResponse(0)
    }

  }, [allApis])

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

  if (isLoading) {
    return <LoadigPage />
  }

  if (!isAuthenticated) {
    return null
  }

  // ---------------- Chart Data ----------------

  const responseTrendData = allApis.slice(0, 10).map((api, index) => ({
    name: `API ${index + 1}`,
    response: api.lastResponseTimeMs
  }))

  const slowestApis = [...allApis]
    .sort((a, b) => b.lastResponseTimeMs - a.lastResponseTimeMs)
    .slice(0, 5)
    .map(api => ({
      name: api.name,
      response: api.lastResponseTimeMs
    }))

  const upCount = allApis.filter(api => api.lastResponseTimeMs < 500).length
  const downCount = allApis.filter(api => api.lastResponseTimeMs >= 500).length

  const statusData = [
    { name: "UP", value: upCount },
    { name: "SLOW/DOWN", value: downCount }
  ]

  const COLORS = ["#22c55e", "#ef4444"]

  return (

    <div className="p-6 space-y-6 animate-fade-in">

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to API Sentinel. Monitor your APIs with ease.
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Total Projects"
          data={allProjects.length}
          icon={<FolderOpen />}
          accentClass="bg-blue-400/10 text-blue-400"
          description="Active monitoring projects"
        />

        <DashboardCard
          title="Total APIs"
          data={allApis.length}
          icon={<Globe />}
          accentClass="bg-emerald-400/10 text-emerald-400"
          description="Endpoints being watched"
        />

        <DashboardCard
          title="Avg Response Time"
          data={Number((averageResponse).toFixed(1))}
          suffix="ms"
          icon={<Activity />}
          accentClass="bg-amber-400/10 text-amber-400"
          description="Across all endpoints"
        />

        <DashboardCard
          title="Active Alerts"
          data={3}
          icon={<BarChart3 />}
          accentClass="bg-rose-400/10 text-rose-400"
          description="Require attention"
        />

      </div>

      {/* Charts Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Response Trend */}

        <Card>

          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>Latest API response times</CardDescription>
          </CardHeader>

          <CardContent className="h-[250px]">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={responseTrendData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="response"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />

              </LineChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

        {/* Status Distribution */}

        <Card>

          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>Current health distribution</CardDescription>
          </CardHeader>

          <CardContent className="h-[250px] flex items-center justify-center">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >

                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

        {/* Slowest APIs */}

        {/* <Card>

          <CardHeader>
            <CardTitle>Slowest APIs</CardTitle>
            <CardDescription>Highest response times</CardDescription>
          </CardHeader>

          <CardContent className="h-[250px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={slowestApis}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="response"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card> */}

      </div>

      {/* Recent Activity */}

      <Card>

        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest API checks and alerts</CardDescription>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">API /api/users is up</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">API /api/orders is down</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New project created</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}