import cron from "node-cron";
import { prisma } from "../config/db.js";

export const cleanupLogs = () => {

    console.log("Cron job initialized");

    cron.schedule("* * * * *", async () => {
        console.log("Logs cleanup started");
        await prisma.apiCheckLog.deleteMany({
            where: {
                checkedAt: {
                    lt: new Date(Date.now() - 1000 * 60 * 60 * 24)
                }
            }
        })
        console.log("Logs older then 24 hours deleted");
    })
    
}