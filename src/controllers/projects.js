import { getAllProjects, getUpcomingProjects, getProjectDetails } from "../models/projects.js"; 

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

export { showProjectsPage, showProjectDetailsPage };
