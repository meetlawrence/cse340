import express from 'express';

// Import controllers
import { showHomePage } from './index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
} from './organizations.js';

import { showProjectsPage } from './projects.js';
import { showProjectDetailsPage } from './projects.js'; 
import { showCategoriesPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

// Define routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage); 
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;