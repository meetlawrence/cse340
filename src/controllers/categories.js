import { body, validationResult } from 'express-validator';

import {
    getAllCategories,
    createCategory,
    updateCategory
} from "../models/categories.js";

import { getProjectDetails, getCategoriesByServiceProjectId } from "../models/projects.js";
import { 
    updateCategoryAssignments, 
    getprojectsByCategory, 
    getCategoriesForProject, 
    getCategoryById
} from "../models/categories.js";

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Project Categories';

    res.render('categories', { title, categories });
};
/* *****************************
 * Display Category Details Page
 * URL: /category/:id
 * *****************************/
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await getCategoryById(categoryId);
        const projects = await getprojectsByCategory(categoryId);

        if (!category) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }

       
        res.render('category-details', { 
            title: `Category: ${category.category_name}`, 
            category, 
            projects 
        });
    } catch (error) {
        console.error('Error fetching category details:', error);
        req.flash('error', 'Error fetching category details.');
        return res.redirect('/categories');
    }
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// SERVER-SIDE VALIDATION: 3 to 100 characters
const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters.')
];

const showNewCategoryForm = async (req, res) => {
    const title = 'Create New Category';
    res.render('new-category', { title });
};

/* *****************************
 * Process New Category (POST)
 * *****************************/
const processNewCategoryForm = async (req, res) => {
    const { categoryName } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    try {
        await createCategory(categoryName);
        req.flash('success', 'New category added successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to create category.');
        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res) => {
    const category = await getCategoryById(req.params.id);
    res.render('edit-category', { title: 'Edit Category', category });
};

/* *****************************
 * Process Edit Category (POST)
 * *****************************/
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const { categoryName } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        await updateCategory(categoryId, categoryName);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        req.flash('error', 'Failed to update category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

export {
    showCategoriesPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm
};