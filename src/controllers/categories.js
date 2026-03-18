import { getAllCategories } from "../models/categories.js";
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

export { showCategoriesPage, showAssignCategoriesForm, processAssignCategoriesForm, showCategoryDetailsPage };