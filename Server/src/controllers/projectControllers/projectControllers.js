import projectServices from "../../services/projectServices/projectServices.js";



const createProject = async (req, res) => {

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
        return res.status(500).json({ error: "Internal server error while creating project" });
    }

}


const getAllProjects = async (req, res) => {
    try {
        const userId = req.user?.id;

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10

        const projects = await projectServices.getAllProjects({ userId, page, limit });

        return res.status(200).json({
            status: "success",
            message: "Projects fetched successfully",
            projects
        });

    } catch (error) {
        console.log("Error fetching projects", error.message);
        return res.status(500).json({ error: "Internal server error while fetching all projects" });
    }
}


const getProjectById = async (req, res) => {
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
        return res.status(500).json({ error: "Internal server error while fetching project by id" });
    }
}


const updateProject = async (req, res) => {
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
        return res.status(500).json({ error: "Internal server error while updating project" });
    }
}


const deleteProject = async (req, res) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.id;

        const deletedProject = await projectServices.deleteProject({ projectId, userId });

        return res.status(204).json({
            status: "success",
            message: "Project deleted successfully",
            deletedProject
        });

    } catch (error) {
        console.log("Error deleting project", error.message);
        return res.status(500).json({ error: "Internal server error while deleting project" });
    }
}



export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
}