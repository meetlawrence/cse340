import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_name
      FROM public.categories;
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

export { getAllCategories, updateCategoryAssignments };