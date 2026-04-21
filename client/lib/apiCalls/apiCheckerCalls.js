import apiAuth from './authApi';

/**
 * Send an instant API check request through the backend proxy.
 *
 * @param {Object} payload
 * @param {string} payload.url        - Target endpoint URL
 * @param {string} payload.method     - HTTP method (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
 * @param {string} payload.authType   - NONE | BEARER_TOKEN | API_KEY | BASIC_AUTH | CUSTOM_HEADER
 * @param {string} [payload.authToken]
 * @param {string} [payload.authHeaderName]
 * @param {string} [payload.authHeaderValue]
 * @param {string} [payload.username]
 * @param {string} [payload.password]
 * @param {string} [payload.body]     - JSON string for request body (POST/PUT/PATCH)
 *
 * @returns {{ status: boolean, message: string, result: {success, status, responseTime, ...} }}
 */
const checkInstantApi = async (payload) => {
    try {
        console.log("Payload for instant check API: ", payload);

        const response = await apiAuth.post('/user/apis/check-instant', payload);
        console.log("Response for instant check API: ", response.data);

        // Response structure from server: { status: true, message: "...", result: {...} }
        return response.data;
    } catch (error) {
        // If the backend returns a structured error, surface it with consistent structure
        if (error.response?.data) {
            return {
                status: false,
                message: error.response.data.message || error.response.data.error || 'Request failed',
                result: {
                    success: false,
                    status: error.response.status,
                    statusText: 'ERROR',
                    responseTime: 0,
                    data: null,
                    headers: {},
                    size: 0,
                    timestamp: new Date().toISOString(),
                    error: error.response.data.message || error.response.data.error || 'Request failed'
                }
            };
        }
        // Network error or other issues
        return {
            status: false,
            message: 'Failed to check API',
            result: {
                success: false,
                status: 0,
                statusText: 'NETWORK_ERROR',
                responseTime: 0,
                data: null,
                headers: {},
                size: 0,
                timestamp: new Date().toISOString(),
                error: error.message || 'Network error'
            }
        };
    }
};

export const apiCheckerCalls = {
    checkInstantApi,
};
