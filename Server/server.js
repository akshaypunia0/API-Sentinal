import dotenv from "dotenv"
dotenv.config()

import app from "./src/app.js"
import { connectDB } from "./src/config/db.js"
import monitoringServices from "./src/services/monitoringServices/monitoringServices.js"

import { cleanupLogs } from "./src/cron/cleanupLogs.js"
import monitoringScheduler from "./src/cron/monitoringScheduler.js"

const PORT = process.env.PORT || 4001

connectDB()

// Start API monitoring scheduler with custom intervals
monitoringScheduler();

// old data cleanup
cleanupLogs()


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})