import express from 'express';

import { checkLogin } from '../middleware/auth.js';

// Import controllers
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout
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
router.get('/organizations', checkLogin, showOrganizationsPage);
router.get('/projects', checkLogin, showProjectsPage);
router.get('/project/:id', checkLogin, showProjectDetailsPage); 
router.get('/categories', checkLogin,showCategoriesPage);
router.get('/category/:id', checkLogin, showCategoryDetailsPage);
router.get('/organization/:id', checkLogin, showOrganizationDetailsPage);
router.get('/new-organization', checkLogin, showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', checkLogin, showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Routes for new projects
router.get('/new-project', checkLogin, showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', checkLogin, showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/edit-project/:id', checkLogin, showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

router.get('/new-category', checkLogin, showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', checkLogin, showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;