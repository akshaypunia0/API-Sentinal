'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle, XCircle, Clock } from 'lucide-react'
import { authUtils } from '@/lib/apiCalls/authApi'

export default function CheckApiPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    url: '',
    method: 'GET',
    headers: '',
    body: ''
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChecking(true)
    setResult(null)

    // Mock API check - replace with real implementation
    setTimeout(() => {
      setResult({
        status: 200,
        responseTime: 245,
        success: true,
        headers: {
          'content-type': 'application/json',
          'server': 'nginx/1.18.0'
        },
        body: '{"message": "API is working", "status": "success"}'
      })
      setIsChecking(false)
    }, 2000)
  }

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
    return null // Will redirect
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Checker</h1>
        <p className="text-muted-foreground">Test any API endpoint manually</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test API Endpoint</CardTitle>
            <CardDescription>
              Enter the details of the API you want to test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">API URL</Label>
                <Input
                  id="url"
                  placeholder="https://api.example.com/endpoint"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">HTTP Method</Label>
                <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headers">Headers (JSON format)</Label>
                <Input
                  id="headers"
                  placeholder='{"Authorization": "Bearer token"}'
                  value={formData.headers}
                  onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                />
              </div>

              {['POST', 'PUT', 'PATCH'].includes(formData.method) && (
                <div className="space-y-2">
                  <Label htmlFor="body">Request Body (JSON)</Label>
                  <Input
                    id="body"
                    placeholder='{"key": "value"}'
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  />
                </div>
              )}

              <Button type="submit" disabled={isChecking} className="w-full">
                {isChecking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Test API
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Response details from the API test
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <Badge variant={result.success ? "default" : "destructive"}>
                    Status: {result.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Response time: {result.responseTime}ms
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Response Headers</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.headers, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Response Body</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {result.body}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Run a test to see the results here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}