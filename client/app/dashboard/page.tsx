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


  interface dashboardData {
    stats: object,
    charts: object
  }

  interface latestProjects {
    name: string,
    createdAt: string
  }

  interface latestApi {
    url: string,
    method: string,
    createdAt: string
  }


  interface recentActivities {
    latestProject: latestProjects,
    latestApi: latestApi
  }




  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  const [dashboardData, setDashboardData] = useState<dashboardData | null>(null)
  const [recentActivities, setRecentActivities] = useState<recentActivities | null>(null)



  const getDashboardData = async () => {
    const response = await projectApiCalls.getDashboardData()
    setDashboardData(response.dashboardData)
  }

  const getRecentActivities = async () => {
    const response = await projectApiCalls.getRecentActivity()
    setRecentActivities(response.recentActivities)

  }

  useEffect(() => {

    getDashboardData()
    getRecentActivities()

    const interval = setInterval(() => {
      getDashboardData()
    }, 21000)

    return () => clearInterval(interval)

  }, [])


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

  const responseTrendData =
    dashboardData?.charts?.responseTimeTrend?.map((item: any) => ({
      time: new Date(item.time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      responseTime: item.responseTime
    }))?.reverse() || []


  const statusData = dashboardData?.charts?.statusDistribution
    ? [
      { name: "Healthy", value: dashboardData.charts.statusDistribution.healthy },
      { name: "Slow", value: dashboardData.charts.statusDistribution.slow },
      { name: "Down", value: dashboardData.charts.statusDistribution.down }
    ]
    : []

  const STATUS_COLORS: Record<string, string> = {
    Healthy: "#22c55e", // green
    Slow: "#f59e0b",    // yellow
    Down: "#ef4444"     // red
  }



  const formatLastCheckedAt = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffSeconds < 60) {
      return `${diffSeconds === 1 ? '1 second' : `${diffSeconds} seconds`} ago`
    } else if (diffMinutes < 60) {
      return `${diffMinutes === 1 ? '1 minute' : `${diffMinutes} minutes`} ago`
    } else if (diffHours < 24) {
      return `${diffHours === 1 ? '1 hour' : `${diffHours} hours`} ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays === 1 ? '1 day' : `${diffDays} days`} ago`
    }
  }

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
          data={dashboardData?.stats?.totalProjects}
          icon={<FolderOpen />}
          accentClass="bg-blue-400/10 text-blue-400"
          description="Active monitoring projects"
        />

        <DashboardCard
          title="Total APIs"
          data={dashboardData?.stats?.totalApis}
          icon={<Globe />}
          accentClass="bg-emerald-400/10 text-emerald-400"
          description="Endpoints being watched"
        />

        <DashboardCard
          title="Avg Response Time"
          data={dashboardData?.stats?.avgResponseTime}
          suffix="ms"
          icon={<Activity />}
          accentClass="bg-amber-400/10 text-amber-400"
          description="Across all endpoints"
        />

        <DashboardCard
          title="Active Alerts"
          data={dashboardData?.stats?.activeAlerts}
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

                <XAxis dataKey="time" />

                <YAxis dataKey="responseTime" />

                <Tooltip />

                <Line
                  dataKey="responseTime"
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
                    <Cell
                      key={index}
                      fill={STATUS_COLORS[entry.name]}
                    />
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

            {/* <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">API /api/users is up</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div> */}



            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Recently register API: {recentActivities?.latestApi.url}</p>
                <p className="text-sm font-medium">method: {recentActivities?.latestApi?.method}</p>
                <p className="text-xs text-muted-foreground">registered: {formatLastCheckedAt(recentActivities?.latestApi?.createdAt)}</p>
              </div>
            </div>



            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Recently created project: {recentActivities?.latestProject?.name}</p>
                <p className="text-xs text-muted-foreground">created: {formatLastCheckedAt(recentActivities?.latestProject?.createdAt)}</p>
              </div>
            </div>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}