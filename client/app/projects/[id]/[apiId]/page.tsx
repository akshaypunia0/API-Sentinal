"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  Eye,
  Edit3,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Shield,
  Key,
  Settings
} from 'lucide-react'
import { apimanagementApiCalls } from '@/lib/apiCalls/apiManagementCalls'

const page = () => {
  const { id, apiId } = useParams()

  console.log("id", id);
  console.log("apiId", apiId);


  interface apiData {
    id: string,
    title: string,
    url: string,
    method: string,
    intervalMinutes: number,
    expectedStatusCodes: number[],
    isActive: boolean,
    authType: string,
    authHeaderName: string,
    authHeaderValue: string,
    currentStatus: string,
    lastCheckedAt: string,
    lastResponseTimeMs: number,
    failureCount: number,
    createdAt: string,
    healthCheckUrl: string | null
  }

  interface recentLogs {
    id: string,
    status: string,
    responseTimeMs: number,
    statusCode: number,
    checkedAt: string
  }

  // Mock data - replace with your API calls
  const [apiData, setApiData] = useState<apiData | null>(null)
  const [recentLogs, setRecentLogs] = useState<recentLogs[]>([])

  useEffect(() => {
    // Fetch API data here
    getApiData()
    getRecentLogs()

    const interval = setInterval(() => {
      getApiData()
      getRecentLogs()
    }, 21000)

    return () => clearInterval(interval)

  }, [id, apiId])

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

  type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

  const methodColors: Record<HttpMethod, string> = {
    GET: "bg-green-500/10 text-green-500",
    POST: "bg-blue-500/10 text-blue-500",
    PUT: "bg-yellow-500/10 text-yellow-500",
    DELETE: "bg-red-500/10 text-red-500",
    PATCH: "bg-purple-500/10 text-purple-500"
  }

  const getMethodColor = (method: HttpMethod) => {
    return methodColors[method]
  }


  // Api calls here


  const getApiData = async () => {
    if (typeof id !== 'string' || typeof apiId !== 'string') {
      return
    }

    const response = await apimanagementApiCalls.getApiById(id, apiId)

    console.log("response", response);

    setApiData(response.apiData)
  }

  const getRecentLogs = async () => {
    if (typeof id !== 'string' || typeof apiId !== 'string') {
      return
    }

    const response = await apimanagementApiCalls.getApiLogs(id, apiId)
    setRecentLogs(response.logs)
  }

  console.log("apiData", apiData)
  console.log("recentLogs", recentLogs)





  if (!apiData) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen animate-pulse">
  
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-muted rounded"></div>
          <div className="h-4 w-4 bg-muted rounded"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
          <div className="h-4 w-4 bg-muted rounded"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
  
  
        {/* Header */}
        <div className="flex justify-between items-start">
  
          <div className="space-y-3">
            <div className="h-6 w-24 bg-muted rounded"></div>
            <div className="h-8 w-80 bg-muted rounded"></div>
            <div className="h-4 w-96 bg-muted rounded"></div>
          </div>
  
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-muted rounded"></div>
            <div className="h-9 w-20 bg-muted rounded"></div>
          </div>
  
        </div>
  
  
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-muted"
            />
          ))}
  
        </div>
  
  
        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  
          {/* Configuration */}
          <div className="lg:col-span-2 rounded-lg bg-muted h-64"></div>
  
          {/* Quick actions */}
          <div className="rounded-lg bg-muted h-64"></div>
  
        </div>
  
  
        {/* Logs Table */}
        <div className="rounded-lg border p-6 space-y-4">
  
          <div className="flex gap-4">
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
          </div>
  
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-muted rounded"
            />
          ))}
  
        </div>
  
      </div>
    )
  }


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-screen">

      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground gap-2">
        <span className="hover:text-foreground cursor-pointer">Projects</span>
        <span>/</span>
        <span className="hover:text-foreground cursor-pointer">Project</span>
        <span>/</span>
        <span className="text-foreground font-medium">{apiData?.title}</span>
      </div>


      {/* Header */}
      <div className="flex items-start lg:items-center justify-between gap-4 flex-wrap">

        <div className="flex items-center gap-4 flex-1 min-w-0">

          <Badge className={`px-3 py-1 text-sm font-semibold ${getMethodColor(apiData?.method as HttpMethod)}`}>
            {apiData?.method}
          </Badge>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {apiData?.title}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <code className="font-mono text-xs bg-muted px-3 py-1 rounded-md truncate max-w-[450px]">
                {apiData?.url}
              </code>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => navigator.clipboard.writeText(apiData.url)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>


        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>

          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>


      {/* Status Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <div className="flex items-center gap-2">
              {apiData.currentStatus === "UP" ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-destructive" />
              )}
              <span className="font-semibold text-lg">
                {apiData.currentStatus}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last checked {formatLastCheckedAt(apiData?.lastCheckedAt)}
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground mb-1">Response Time</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-lg">
                {apiData?.lastResponseTimeMs} ms
              </span>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground mb-1">Failures</p>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-lg">
                {apiData.failureCount}
              </span>
            </div>
          </CardContent>
        </Card>


        {/* <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Monitoring</p>
          <span className="font-semibold">
            {apiData.isActive ? "Active" : "Paused"}
          </span>
        </div>

        <Switch
          checked={apiData.isActive}
          className="data-[state=checked]:bg-primary"
        />
      </CardContent>
    </Card> */}

      </div>



      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5" />
              Configuration
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            <div className="grid grid-cols-2 gap-y-4 gap-x-10 text-sm">

              <div className="text-muted-foreground">
                Check Interval
              </div>

              <div className="font-medium">
                {apiData?.intervalMinutes} minutes
              </div>


              <div className="text-muted-foreground">
                Expected Status
              </div>

              <div className="flex flex-wrap gap-2">
                {apiData?.expectedStatusCodes.map((code) => (
                  <Badge key={code} variant="outline">
                    {code}
                  </Badge>
                ))}
              </div>


              <div className="text-muted-foreground">
                Authentication
              </div>

              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">
                  {apiData.authType}
                </span>
              </div>


              <div className="text-muted-foreground">
                Auth Header
              </div>

              <div className="font-mono text-sm">
                {apiData.authHeaderName || "N/A"}
              </div>

            </div>

          </CardContent>
        </Card>



        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Quick Actions
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">

            <Button className="w-full justify-start" variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Test Now
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Logs
            </Button>

            <Button className="w-full justify-start" variant="outline">
              <Key className="w-4 h-4 mr-2" />
              Copy cURL
            </Button>

          </CardContent>
        </Card>

      </div>



      {/* Logs & History */}
      <Card>

        <Tabs defaultValue="logs" className="w-full">

          <TabsList className="w-full bg-muted rounded-lg">
            <TabsTrigger value="logs">
              5 Recent Logs History
            </TabsTrigger>
          </TabsList>


          <TabsContent value="logs" className="pt-2">

            <div className="overflow-x-auto rounded-md border">

              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Last checked</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Status Code</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {recentLogs.slice(0, 5).map((log, i) => (

                    <TableRow
                      key={log.id}
                      className="hover:bg-muted/40 transition"
                    >

                      <TableCell>
                        {formatLastCheckedAt(log.checkedAt)}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={
                            log.status === "UP"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {log.responseTimeMs}
                      </TableCell>

                      <TableCell>
                        {log.statusCode}
                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>

          </TabsContent>

        </Tabs>

      </Card>

    </div>
  )
}

export default page
