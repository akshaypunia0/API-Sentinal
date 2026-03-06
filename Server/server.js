import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import { connectDB } from "./src/config/db.js"
import monitoringServices from "./src/services/monitoringServices/monitoringServices.js"
import cron from "node-cron"

const PORT = process.env.PORT || 4001

connectDB()

// Start API monitoring scheduler with custom intervals
const startMonitoringScheduler = () => {
    console.log("🚀 Starting API monitoring scheduler...")

    // Define interval configurations
    const intervals = [
        { minutes: 1, cronExpression: "*/1 * * * *" },
        { minutes: 5, cronExpression: "*/5 * * * *" },
        { minutes: 10, cronExpression: "*/10 * * * *" },
        { minutes: 15, cronExpression: "*/15 * * * *" },
        { minutes: 30, cronExpression: "*/30 * * * *" },
        { minutes: 60, cronExpression: "0 * * * *" } // Every hour at minute 0
    ];

    // Create a cron job for each interval
    intervals.forEach(({ minutes, cronExpression }) => {
        cron.schedule(cronExpression, async () => {
            console.log(`⏰ Monitoring check started for ${minutes}-minute interval at ${new Date().toISOString()}`)
            try {
                await checkApisByInterval(minutes);
            } catch (error) {
                console.error(`❌ Monitoring cycle failed for ${minutes}-minute interval:`, error)
            }
        });

        console.log(`✅ Scheduled ${minutes}-minute interval monitoring (${cronExpression})`);
    });

    console.log("✅ All monitoring schedulers started")
}

// Check APIs that have a specific interval
const checkApisByInterval = async (intervalMinutes) => {
    try {
        const { prisma } = await import("./src/config/db.js");

        // Get all active APIs with this specific interval
        const apisToCheck = await prisma.api.findMany({
            where: {
                isActive: true,
                intervalMinutes: intervalMinutes
            }
        });

        if (apisToCheck.length === 0) {
            console.log(`ℹ️ No APIs configured for ${intervalMinutes}-minute interval`);
            return;
        }

        console.log(`🔍 Checking ${apisToCheck.length} APIs with ${intervalMinutes}-minute interval`);

        // Check each API in this interval
        const results = [];
        for (const api of apisToCheck) {
            const result = await monitoringServices.checkApi(api);
            results.push(result);
        }

        console.log(`✅ ${intervalMinutes}-minute interval check completed. Checked ${results.length} APIs`);
        return results;

    } catch (error) {
        console.error(`❌ Error in ${intervalMinutes}-minute interval check:`, error);
        throw error;
    }
};

// Start the scheduler
startMonitoringScheduler()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})