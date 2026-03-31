import { prisma } from "../../config/db.js";


const addToWaitlist = async(email) => {
    return await prisma.waitlist.create({
        data: {
            email
        }
    });
}

export const waitlistServices = {
    addToWaitlist
}