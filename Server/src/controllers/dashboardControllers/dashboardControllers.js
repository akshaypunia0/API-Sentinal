import dashboardServices from "../../services/dashboardServices/dashboardServices.js";

const dashboardData = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        const response = await dashboardServices.getDashboardData(userId)

        res.status(200).json({
            status: "success",
            message: "Dashboard data fetched",
            dashboardData: response

        })


        
    } catch (error) {
        next(error)
    }
}


const getRecentActivities = async (req, res, next) => {
    try {
        const { userId } = req.user?.id

        const response = await dashboardServices.getRecentActivities(userId)

        res.status(200).json({
            status: "success",
            message: "Recent activities fetched successfull",
            recentActivities: response

        })

    } catch (error) {
        next(error)
    }
}


export {
    dashboardData,
    getRecentActivities
}