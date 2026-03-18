import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, category_name
      FROM public.categories
      ORDER BY category_name ASC;
    `;

    const result = await db.query(query);
    return result.rows;
}

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

// const updateCategoryAssignments = async(projectId, categoryIds) => {
//     // First, remove existing category assignments for the project
//     const deleteQuery = `
//         DELETE FROM project_categories
//         WHERE project_id = $1;
//     `;
//     await db.query(deleteQuery, [projectId]);

//     // Next, add the new category assignments
//     for (const categoryId of categoryIds) {
//         await assignCategoryToProject(categoryId, projectId);
//     }
// }

const updateCategoryAssignments = async (projectId, categoryIds) => {
    try {
        await db.query('BEGIN'); // Start transaction for safety

        // 1. Wipe the slate clean
        await db.query('DELETE FROM project_categories WHERE project_id = $1', [projectId]);

        // 2. Loop through the IDs
        for (let catId of categoryIds) {
            
            // THE FIX: Only query if catId is a truthy value and NOT an empty string
            if (catId !== "" && catId !== null && catId !== undefined) {
                const insertQuery = `
                    INSERT INTO project_categories (project_id, category_id) 
                    VALUES ($1, $2)
                `;
                // Ensure catId is treated as an integer
                await db.query(insertQuery, [projectId, parseInt(catId)]);
            }
        }

        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    }
};

const getCategoryById = async (category_id) => { 
    try {
        const query = `
            SELECT *
            FROM public.categories
            WHERE category_id = $1;
        `;

        const result = await db.query(query, [category_id]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
};


const getprojectsByCategory = async (category_id) => {
    try {
        const query = `
            SELECT p.*
            FROM public.service_projects p
            JOIN public.project_categories pc ON p.project_id = pc.project_id
            WHERE pc.category_id = $1;
        `;

        const result = await db.query(query, [category_id]);
        return result.rows;        
    }
    catch (error) {
        console.error('Error fetching categories for project:', error);
        throw error;
    }
};


const getCategoriesForProject = async (project_id) => {
    try {
        const query = `
            SELECT c.*
            FROM public.categories c
            JOIN public.project_categories pc ON c.category_id = pc.category_id
            WHERE pc.project_id = $1;
        `;
        const result = await db.query(query, [project_id]);

        return result.rows;
    }
    catch (error) {
        console.error('Error fetching categories for project:', error);
        throw error;
    }
};

// Create a new category (for /new-category)
const createCategory = async (categoryName) => {
    try {
        const query = `
            INSERT INTO public.categories (category_name)
            VALUES ($1)
            RETURNING category_id;
        `;
        const result = await db.query(query, [categoryName]);
        return result.rows[0].category_id;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

// Update an existing category name (for /edit-category/:id)
const updateCategory = async (categoryId, categoryName) => {
    try {
        const query = `
            UPDATE public.categories
            SET category_name = $1
            WHERE category_id = $2
            RETURNING category_id;
        `;
        const result = await db.query(query, [categoryName, categoryId]);
        return result.rows[0].category_id;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export {
    getAllCategories,
    updateCategoryAssignments,
    getCategoryById,
    getprojectsByCategory,
    getCategoriesForProject,
    createCategory,
    updateCategory
};