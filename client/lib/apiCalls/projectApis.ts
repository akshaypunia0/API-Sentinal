import apiAuth, { authUtils } from './authApi';

const getAllProjects = async (page: number, limit: number) => {
    try {
        const response = await apiAuth.get(`/user/projects/getAllProjects?page=${page}&limit=${limit}`)

        return response.data
    } catch (error) {
        throw new Error('Failed to fetch projects')
    }
}


const createProject = async (projectData: object) => {
    try {
        const response = await apiAuth.post('/user/projects/createProject', projectData)
        return response.data
    } catch (error) {
        throw new Error('Failed to create project')
    }
}


const getProjectById = async (id: string) => {
    try {
        const response = await apiAuth.get(`/user/projects/getProjectById/${id}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch project details')
    }
}


const updateProject = async (id: string, projectData: object) => {
    try {
        const response = await apiAuth.patch(`/user/projects/updateProject/${id}`, projectData)
        return response.data
    } catch (error) {
        throw new Error('Failed to update project')
    }
}


const deleteProject = async (id: string) => {
    try {
        const response = await apiAuth.delete(`/user/projects/deleteProject/${id}`)
        return response.data
    } catch (error) {
        throw new Error('Failed to delete project')
    }
}


const getDashboardData = async () => {
    try {
        const response = await apiAuth.get("/user/dashboard")

        return response.data
        
    } catch (error) {
        throw new Error("Failed to get Dashboard data")
    }
}


const getRecentActivity = async () => {
    try {
        const response = await apiAuth.get("/user/dashboard/recent")

        return response.data
    } catch (error) {
        throw new Error("Failed to get Recent activities")
    }
}


export const projectApiCalls = {
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getDashboardData,
    getRecentActivity
}