"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apimanagementApiCalls } from '@/lib/apiCalls/apiManagementCalls'
import { projectApiCalls } from '@/lib/apiCalls/projectApis'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoadigPage from '@/components/other/Loadig'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ProjectForm from '@/components/forms/ProjectForm'
import ApiRegistrationForm from '@/components/forms/ApiForm'

const page = () => {

    const params = useParams()

    const id = params?.id as string

    const router = useRouter()


    interface apiData {
        id: string;
        name: string;
        url: string;
        method: string;
        interval: number;
        currentStatus: string;
        lastCheckedAt: string;
        title: string;
        description: string;
        intervalMinutes: number;
    }

    interface projectData {
        name: string;
        description: string;
    }

    const [allApis, setAllApis] = useState<apiData[]>([])
    const [projectData, setProjectData] = useState<projectData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const [open, setOpen] = useState(false)
    const [apiModelOpen, setApiModelOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<any>(null)



    const getAllApis = async () => {
        const response = await apimanagementApiCalls.getAllApisByProjectId(id as string)
        setAllApis(response.apis)
    }

    const getProjectData = async () => {
        const response = await projectApiCalls.getProjectById(id as string)
        setProjectData(response.project)
        setIsLoading(false)
    }

    useEffect(() => {
        getAllApis()
        getProjectData()

        const interval = setInterval(() => {
            getAllApis()
        }, 21000)

        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return <LoadigPage />
    }

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-green-500/10 text-green-400 border-green-500/20'
            case 'POST': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'PUT': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
            case 'DELETE': return 'bg-destructive/10 text-destructive border-destructive/20'
            case 'PATCH': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            default: return 'bg-muted text-muted-foreground border-border'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'UP': return 'bg-green-500/10 text-green-400 border-green-500/20'
            case 'DOWN': return 'bg-destructive/10 text-destructive border-destructive/20'
            default: return 'bg-muted text-muted-foreground border-border'
        }
    }

    const formatInterval = (minutes: number) => {
        if (minutes === 1) return '1 min'
        if (minutes === 60) return '1 hr'
        return `${minutes} min`
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


    const apiDetailPage = (apiId: string) => {
        console.log("Ids here", id, apiId);

        router.push(`/projects/${id}/${apiId}`)
    }



    const handleSubmitProject = async (data: object) => {
        await projectApiCalls.updateProject(id, data)
        getProjectData()
    }

    const handleApiSubmit = async (data: object) => {
        await apimanagementApiCalls.registerApi(id, data)
        getAllApis()
    }


    return (
        <div>

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{projectData?.name}</h1>
                        <p className="text-muted-foreground mt-1">{projectData?.description}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-sidebar-border hover:bg-sidebar-accent"
                            onClick={() => {
                                setSelectedProject(projectData)
                                setOpen(true)
                            }}
                        >
                            Edit Project
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                setApiModelOpen(true)
                            }}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            New API
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card p-6 rounded-xl border">
                        <div className="text-2xl font-bold text-primary">{allApis.length}</div>
                        <div className="text-sm text-muted-foreground mt-1">Total APIs</div>
                    </div>
                    <div className="glass-card p-6 rounded-xl border">
                        <div className="text-2xl font-bold text-green-400">{allApis.filter((api) => api.currentStatus === 'UP').length}</div>
                        <div className="text-sm text-muted-foreground mt-1">UP</div>
                    </div>
                    <div className="glass-card p-6 rounded-xl border">
                        <div className="text-2xl font-bold text-destructive">{allApis.filter((api) => api.currentStatus === 'DOWN').length}</div>
                        <div className="text-sm text-muted-foreground mt-1">DOWN</div>
                    </div>
                </div>

                {/* APIs Table */}

                {
                    allApis.length > 0 ? (
                        <div className="glass-card-subtle rounded-xl border p-1">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold">APIs</h2>
                                    <select className="px-3 py-1.5 bg-sidebar text-sidebar-foreground border border-sidebar-border rounded-md text-sm">
                                        <option>All Status</option>
                                        <option>Healthy</option>
                                        <option>Issues</option>
                                    </select>
                                </div>

                                <div className="overflow-x-auto rounded-md border border-border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-b border-border">
                                                <TableHead className="w-25 pr-6 font-medium text-sidebar-foreground">API Name</TableHead>
                                                <TableHead className="w-30 font-medium text-sidebar-foreground">Method</TableHead>
                                                <TableHead className="min-w-62.5 font-medium text-sidebar-foreground">Endpoint</TableHead>
                                                <TableHead className="w-25 font-medium text-sidebar-foreground">Interval</TableHead>
                                                <TableHead className="w-35 font-medium text-sidebar-foreground">Status</TableHead>
                                                <TableHead className="w-24 text-right font-medium text-sidebar-foreground">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allApis.length > 0 ? allApis.map((api, index) => (
                                                <TableRow
                                                    key={api.id}
                                                    className="group hover:bg-sidebar-accent/50 transition-colors border-b border-border/50 last:border-b-0 animate-slide-up"
                                                    style={{ animationDelay: `${100 + index * 100}ms` }}
                                                >
                                                    <TableCell className="pr-6 font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <div>
                                                                <div className="font-medium text-sidebar-foreground">{api.title}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`px-3 py-1 text-xs font-medium ${getMethodColor(api.method)}`}
                                                            variant="outline"
                                                        >
                                                            {api.method}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm text-sidebar-foreground truncate max-w-75">
                                                        {api.url}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs bg-sidebar-accent text-sidebar-accent-foreground"
                                                        >
                                                            {formatInterval(api.intervalMinutes)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full animate-pulse ${api.currentStatus === 'UP' ? 'bg-green-400' : 'bg-destructive'}`}></div>
                                                            <Badge
                                                                className={`text-sm font-medium ${getStatusColor(api.currentStatus)}`}
                                                                variant="outline"
                                                            >
                                                                {api.currentStatus === 'UP' ? 'UP' : 'DOWN'}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground text-right">{formatLastCheckedAt(api.lastCheckedAt)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex gap-1 p-1 rounded-md bg-sidebar-accent/20 group-hover:bg-sidebar-accent/50 transition-all">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
                                                                onClick={() => apiDetailPage(api.id)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>

                                                </TableRow>
                                            )) : ""}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Card className="glass-card border-0 max-w-2xl mx-auto">
                            <CardHeader className="text-center pb-2">
                                <div className="w-20 h-20 mx-auto mb-6 bg-sidebar-accent/30 rounded-2xl flex items-center justify-center">
                                    <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-2xl font-bold text-sidebar-foreground">
                                    No APIs Yet
                                </CardTitle>
                                <CardDescription className="text-muted-foreground mt-2">
                                    This project is empty. Add your first API endpoint to start monitoring its health and performance in real-time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 pb-6">
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        setApiModelOpen(true)
                                    }} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Your First API
                                </Button>
                            </CardContent>
                        </Card>
                    )
                }

            </div>


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

            <Dialog open={apiModelOpen} onOpenChange={setApiModelOpen}>
                <DialogContent
                    className="fixed! inset-0! top-0! left-0! translate-x-0! translate-y-0! max-w-none! w-auto! rounded-none! bg-black/60 backdrop-blur-sm border-none shadow-none ring-0 flex items-center justify-center overflow-y-auto p-6 sm:p-10"
                    showCloseButton={false}
                >
                    <DialogTitle className="hidden" />
                    <DialogHeader className="hidden" />
                    <div className="w-full max-w-[750px] relative">
                        {/* Custom close button */}
                        <button
                            type="button"
                            onClick={() => setApiModelOpen(false)}
                            className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#2a2a2a] transition-colors shadow-lg"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                        <ApiRegistrationForm
                            projectId={id}
                            initialData={null}
                            onSubmit={handleApiSubmit}
                            setOpen={setApiModelOpen}
                        />
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default page
