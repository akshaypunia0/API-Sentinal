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
 * @returns {{ status, responseTime, headers, body, success, error? }}
 */


//  * @returns {{ status, responseTime, headers, body, success, error? }}
const checkInstantApi = async (payload) => {
    try {
        console.log("Payload for instant check API: ", payload);

        const response = await apiAuth.post('/user/apis/check-instant', payload);
        console.log("Response for instant check API: ", response.data);

        return response.data;
    } catch (error) {
        // If the backend returns a structured error, surface it
        if (error.response?.data) {
            return {
                success: false,
                error: error.response.data.message || error.response.data.error || 'Request failed',
                status: error.response.status,
            };
        }
        throw new Error('Failed to check API');
    }
};

export const apiCheckerCalls = {
    checkInstantApi,
};
