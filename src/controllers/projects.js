import { 
    getAllProjects, 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject, 
    getCategoriesByServiceProjectId,
    updateProject
} from "../models/projects.js";

import { getAllOrganizations } from "../models/organization.js";
import { body, validationResult } from 'express-validator';

import { checkVolunteerStatus } from "../models/volunteer.js";

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];


// Constant for the number of upcoming projects to display on the homepage
const NUMBER_OF_UPCOMING_PROJECTS = 5; 

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    try {
        const project = await getProjectDetails(projectId);
        
        // FETCH THE CATEGORIES HERE
        const assignedCategories = await getCategoriesByServiceProjectId(projectId);

        let isVolunteering = false;

        if (res.locals.user) {
            isVolunteering = await checkVolunteerStatus(res.locals.user.user_id, projectId);
        }

        if (!project) {
            return res.status(404).send("Project not found");
        }

        // PASS THEM TO THE VIEW HERE
        res.render('project', { 
            title: project.title, 
            project, 
            assignedCategories, // This makes 'assignedCategories' available in project.ejs
            isVolunteering
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("Internal Server Error");
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    const title = 'Edit Service Project';
    res.render('edit-project', { title, project, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("SQL ERROR:", error.message); // This will show in your terminal/console
        req.flash('error', 'Database update failed.');
        res.redirect(`/edit-project/${projectId}`);
    }
}

// Export all controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
};
