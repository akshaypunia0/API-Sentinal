import { prisma } from "../../config/db.js";
import AppError from "../../utills/appError.js";


const addToWaitlist = async(email) => {

    const existing = await prisma.waitlist.findFirst({
        where: { email }
    })

    if(existing) {
        throw new AppError("Already applied for Early Access", 404); 
    }


    return await prisma.waitlist.create({
        data: {
            email
        }
    });
}

export const waitlistServices = {
    addToWaitlist
}