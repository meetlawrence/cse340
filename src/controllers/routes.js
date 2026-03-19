import express from 'express';

// Import controllers
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole
} from './users.js';

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

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/', showHomePage);
// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// Organization routes
router.get('/organizations', requireLogin, showOrganizationsPage);
router.get('/projects', requireLogin, showProjectsPage);
router.get('/project/:id', requireLogin, showProjectDetailsPage); 
router.get('/categories', requireLogin, showCategoriesPage);
router.get('/category/:id', requireLogin, showCategoryDetailsPage);
router.get('/organization/:id', requireLogin, showOrganizationDetailsPage);
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Routes for new projects
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;