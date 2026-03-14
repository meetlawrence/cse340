import express from 'express';

// Import controllers
import { showHomePage } from './index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm
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

router.get('/edit-organizations/:id', showEditOrganizationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

// Route to handle edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processNewOrganizationForm);

export default router;