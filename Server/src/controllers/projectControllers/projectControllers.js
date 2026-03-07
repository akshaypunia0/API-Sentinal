import projectServices from "../../services/projectServices/projectServices.js";



const createProject = async (req, res, next) => {

    try {

        const { name, description } = req.body;
        const userId = req.user?.id;

        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Project name is required" });
        }

        const newProject = await projectServices.createProject({ name, description, userId });

        return res.status(201).json({
            status: "success",
            message: "Project created successfully",
            project: newProject
        });

    } catch (error) {

        if (error.code === "P2002") {
            return res.status(400).json({
                error: "Project with this name already exists"
            });
        }

        console.log("Error creating project", error.message);
        next(error);
    }

}


const createProjectHealthCheck = async (req, res, next) => {
    try {
        const isHealthOk = await projectServices.createProjectHealthCheck();

        if (isHealthOk) {
            return res.status(200).json({
                status: "ok",
                database: "connected",
                timestamp: new Date()
            });
        }
        else {
            return res.status(500).json({
                status: "error",
                database: "disconnected",
                timestamp: new Date()
            });
        }

    } catch (error) {
        console.log("Error creating project health check", error.message);
        next(error);
    }
}


const getAllProjects = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const projects = await projectServices.getAllProjects({ userId, page, limit });

        return res.status(200).json({
            status: "success",
            message: projects.length > 0 ? "Projects fetched successfully" : "You have not created any projects yet",
            projects
        });

    } catch (error) {
        console.log("Error fetching projects", error.message);
        next(error);
    }
}


const getProjectById = async (req, res, next) => {
    try {

        const userId = req.user?.id;
        const projectId = req.params.id;

        const project = await projectServices.getProjectById({ projectId, userId });

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Project fetched successfully",
            project
        });

    } catch (error) {
        console.log("Error fetching project by id", error.message);
        next(error);
    }
}


const updateProject = async (req, res, next) => {
    try {

        const userId = req.user?.id;
        const projectId = req.params.id;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Project name is required" });
        }

        const updatedProject = await projectServices.updateProject({ projectId, userId, name, description });

        return res.status(200).json({
            status: "success",
            message: "Project updated successfully",
            project: updatedProject
        });

    } catch (error) {
        console.log("Error updating project", error.message);
        next(error);
    }
}


const deleteProject = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;

        const deletedProject = await projectServices.deleteProject({ projectId, userId });

        return res.status(204).send();

    } catch (error) {
        console.log("Error deleting project", error.message);
        next(error);
    }
}



export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    createProjectHealthCheck
}