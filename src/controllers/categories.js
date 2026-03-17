import { getAllCategories } from "../models/categories.js";
import { getProjectDetails, getCategoriesByServiceProjectId } from "../models/projects.js";
import { updateCategoryAssignments } from "../models/categories.js";

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Project Categories';

    res.render('categories', { title, categories });
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

export { showCategoriesPage, showAssignCategoriesForm, processAssignCategoriesForm };