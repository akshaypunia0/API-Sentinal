import { prisma } from "../../config/db.js";
import axios from "axios";
import nodemailer from "nodemailer";

// Email configuration
const emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Build authentication headers based on auth type
const buildAuthHeaders = (api) => {
    const headers = {
        'User-Agent': 'API-Sentinel-Monitor/1.0'
    };

    switch (api.authType) {
        case 'BEARER_TOKEN':
            if (api.authToken) {
                headers['Authorization'] = `Bearer ${api.authToken}`;
            }
            break;

        case 'API_KEY':
            if (api.authHeaderName && api.authToken) {
                headers[api.authHeaderName] = api.authToken;
            }
            break;

        case 'BASIC_AUTH':
            if (api.username && api.password) {
                const credentials = Buffer.from(`${api.username}:${api.password}`).toString('base64');
                headers['Authorization'] = `Basic ${credentials}`;
            }
            break;

        case 'CUSTOM_HEADER':
            if (api.authHeaderName && api.authHeaderValue) {
                headers[api.authHeaderName] = api.authHeaderValue;
            }
            break;

        case 'NONE':
        default:
            // No authentication headers
            break;
    }

    return headers;
};

// Check API based on HTTP method (dry-run for non-GET methods)
const checkApi = async (api) => {
    const startTime = Date.now();
    const authHeaders = buildAuthHeaders(api);

    try {
        let response;
        let effectiveMethod = api.method;
        let effectiveUrl = api.url;

        // For non-GET methods, use dry-run approach
        if (api.method !== 'GET') {
            // Strategy 1: Try HEAD request first (checks reachability without body)
            try {
                response = await axios.head(api.url, {
                    timeout: 30000,
                    headers: authHeaders
                });
                effectiveMethod = 'HEAD';
            } catch (headError) {
                // Strategy 2: Try OPTIONS request
                try {
                    response = await axios.options(api.url, {
                        timeout: 30000,
                        headers: authHeaders
                    });
                    effectiveMethod = 'OPTIONS';
                } catch (optionsError) {
                    // Strategy 3: Try GET on health endpoint variations
                    const healthUrls = [
                        `${api.url}/health`,
                        `${api.url}/status`,
                        `${api.url}/ping`,
                        api.url.replace(/\/$/, '') + '/health' // Remove trailing slash and add /health
                    ];

                    for (const healthUrl of healthUrls) {
                        try {
                            response = await axios.get(healthUrl, {
                                timeout: 30000,
                                headers: authHeaders
                            });
                            effectiveUrl = healthUrl;
                            effectiveMethod = 'GET (health)';
                            break;
                        } catch (healthError) {
                            continue; // Try next health URL
                        }
                    }

                    // If all strategies fail, mark as down
                    if (!response) {
                        throw new Error(`All dry-run strategies failed for ${api.method} ${api.url}`);
                    }
                }
            }
        } else {
            // For GET requests, make normal request
            response = await axios.get(api.url, {
                timeout: 30000,
                headers: authHeaders
            });
        }

        const responseTime = Date.now() - startTime;
        const isExpectedStatus = api.expectedStatusCodes.includes(response.status);

        // Create log entry
        const logEntry = await prisma.apiCheckLog.create({
            data: {
                apiId: api.id,
                statusCode: response.status,
                status: isExpectedStatus ? 'UP' : 'DOWN',
                responseTimeMs: responseTime
            }
        });

        // Send alert if API is down
        if (!isExpectedStatus) {
            const project = await prisma.project.findUnique({
                where: { id: api.projectId },
                include: { user: true }
            });

            if (project?.user) {
                await sendDownAlert(api, project.user, effectiveMethod, effectiveUrl);
            }
        }

        console.log(`✅ Checked ${api.title}: ${response.status} (${responseTime}ms) [${effectiveMethod}]`);
        return logEntry;

    } catch (error) {
        const responseTime = Date.now() - startTime;

        // Create failure log entry
        const logEntry = await prisma.apiCheckLog.create({
            data: {
                apiId: api.id,
                statusCode: error.response?.status || 0,
                status: 'DOWN',
                responseTimeMs: responseTime
            }
        });

        // Send alert for failure
        const project = await prisma.project.findUnique({
            where: { id: api.projectId },
            include: { user: true }
        });

        if (project?.user) {
            await sendDownAlert(api, project.user, api.method, api.url);
        }

        console.log(`❌ Failed ${api.title} (${api.method}): ${error.message} (${responseTime}ms)`);
        return logEntry;
    }
};

// Send email alert with method and URL info
const sendDownAlert = async (api, user, effectiveMethod, effectiveUrl) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `🚨 API Down Alert: ${api.title}`,
            html: `
                <h2>API Monitoring Alert</h2>
                <p><strong>API:</strong> ${api.title}</p>
                <p><strong>URL:</strong> ${effectiveUrl}</p>
                <p><strong>Method:</strong> ${effectiveMethod}</p>
                <p><strong>Configured Method:</strong> ${api.method}</p>
                <p><strong>Status:</strong> DOWN</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                <p>Please check your API immediately.</p>
                ${api.method !== 'GET' ? '<p><em>Note: This API uses dry-run monitoring to avoid sending production data.</em></p>' : ''}
            `
        };

        await emailTransporter.sendMail(mailOptions);
        console.log(`Alert email sent to ${user.email} for API: ${api.title}`);
    } catch (error) {
        console.error("Failed to send alert email:", error);
    }
};

// Check all active APIs (called by scheduler)
const checkAllActiveApis = async () => {
    try {
        console.log('🔍 Starting API monitoring check...');

        // Get all active APIs (all methods now supported)
        const activeApis = await prisma.api.findMany({
            where: {
                isActive: true
            }
        });

        console.log(`Found ${activeApis.length} active APIs to monitor`);

        // Check each API
        const results = [];
        for (const api of activeApis) {
            const result = await checkApi(api);
            results.push(result);
        }

        console.log(`✅ Monitoring cycle completed. Checked ${results.length} APIs`);
        return results;

    } catch (error) {
        console.error('❌ Error in monitoring cycle:', error);
        throw error;
    }
};

// Get monitoring logs for an API
const getApiLogs = async ({ apiId, projectId, userId, limit = 50, days = 7 }) => {
    // Verify user owns the project
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        throw new Error("Project not found or access denied");
    }

    // Verify API belongs to project
    const api = await prisma.api.findFirst({
        where: {
            id: apiId,
            projectId
        }
    });

    if (!api) {
        throw new Error("API not found");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.apiCheckLog.findMany({
        where: {
            apiId,
            checkedAt: {
                gte: startDate
            }
        },
        orderBy: {
            checkedAt: 'desc'
        },
        take: limit
    });

    return logs;
};

// Get API statistics
const getApiStats = async ({ apiId, projectId, userId, days = 7 }) => {
    // Verify access
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            userId
        }
    });

    if (!project) {
        throw new Error("Project not found or access denied");
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.apiCheckLog.findMany({
        where: {
            apiId,
            checkedAt: {
                gte: startDate
            }
        }
    });

    if (logs.length === 0) {
        return {
            totalChecks: 0,
            uptimePercentage: 0,
            averageResponseTime: 0,
            downCount: 0
        };
    }

    const upCount = logs.filter(log => log.status === 'UP').length;
    const downCount = logs.filter(log => log.status === 'DOWN').length;
    const uptimePercentage = (upCount / logs.length) * 100;

    const totalResponseTime = logs.reduce((sum, log) => sum + log.responseTimeMs, 0);
    const averageResponseTime = totalResponseTime / logs.length;

    return {
        totalChecks: logs.length,
        uptimePercentage: Math.round(uptimePercentage * 100) / 100,
        averageResponseTime: Math.round(averageResponseTime),
        downCount
    };
};

export default {
    checkAllActiveApis,
    checkApi,
    getApiLogs,
    getApiStats,
    sendDownAlert,
    buildAuthHeaders
};