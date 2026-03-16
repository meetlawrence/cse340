import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject } from "../models/projects.js"; 
import { getAllOrganizations } from "../models/organization.js";

// Constant for the number of upcoming projects to display on the homepage
const NUMBER_OF_UPCOMING_PROJECTS = 5; 

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    // Extracting the ID from the URL parameters
    const projectId = req.params.id;

    // Retrieving the specific project from the database
    const project = await getProjectDetails(projectId);

    res.render('project', { title: project.title, project });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

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

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };
