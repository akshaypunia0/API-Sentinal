import apiAuth from './authApi';

const getAllApis = async () => {
    try {
        const response = await apiAuth.get('/user/apis/totalApis');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch all APIs')
    }
}


const registerApi = async (projectId, apiData) => {
    try {
        const response = await apiAuth.post(`/user/apis/${projectId}/apis`, apiData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to register API')
    }
}


const getAllApisByProjectId = async (projectId) => {
    try {
        const response = await apiAuth.get(`/user/apis/${projectId}/apis`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch APIs for the specified project')
    }
}

const getApiById = async (projectId, apiId) => {
    try {
        const response = await apiAuth.get(`/user/apis/${projectId}/api/${apiId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch API details')
    }
}

const updateApi = async (projectId, apiId, apiData) => {
    try {
        const response = await apiAuth.patch(`/user/apis/${projectId}/api/${apiId}`, apiData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to update API')
    }
}

const deleteApi = async (projectId, apiId) => {
    try {
        const response = await apiAuth.delete(`/user/apis/${projectId}/api/${apiId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete API')
    }
}


const getApiLogs = async (projectId, apiId) => {
    try {
        const response = await apiAuth.get(`/user/apis/${projectId}/api/${apiId}/logs`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch API logs')
    }
}

const getApiStats = async (projectId, apiId) => {
    try {
        const response = await apiAuth.get(`/user/apis/triggerApi`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch API stats')
    }
}


export const apimanagementApiCalls = {
    getAllApis,
    registerApi,
    getAllApisByProjectId,
    getApiById,
    updateApi,
    deleteApi,
    getApiLogs,
    getApiStats
}