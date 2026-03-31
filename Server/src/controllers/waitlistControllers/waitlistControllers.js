import { waitlistServices } from "../../services/waitlistServices/waitlistServices.js";

const addToWaitlist = async (req, res, next) => {
    try {

        const { email } = req.body

        console.log("In req.body email is: ", email);
        

        if (!email) {
            return res.status(400).json({message: "Please provide email"})
        }

        const createdWaitlist = await waitlistServices.addToWaitlist(email)

        return res.status(201).json({
            success: true,
            message: "Added to waitlist",
            data: createdWaitlist
        })


    } catch (error) {
        console.log("Error adding to waitlist", error.message);
        next(error);
    }
}

const waitlistHealthCheck = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Healthcheck success"
        })
    } catch (error) {
        console.log("Error while waitlistHealthCheck", error.message);
        next(error)
    }
}


export {
    addToWaitlist,
    waitlistHealthCheck
}