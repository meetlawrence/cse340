import express from 'express';

// Import controllers
import { showHomePage } from './index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './organizations.js';

import {
    showProjectsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './projects.js';

import { showProjectDetailsPage } from './projects.js'; 

import {
    showCategoriesPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCategoryDetailsPage,
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './categories.js';


import { testErrorPage } from './errors.js';

const router = express.Router();

// Define routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); 
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Routes for new projects
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;