import db from './db.js'


const getAllProjects = async() => {
    const query = `
      SELECT 
    service_projects.project_id, 
    service_projects.title,
    service_projects.project_date,
    service_projects.description, -- Explicitly named
    service_projects.organization_id,
    organization.name             -- To actually see the Org Name!
FROM public.service_projects 
INNER JOIN organization 
    ON service_projects.organization_id = organization.organization_id
    ORDER BY service_projects.project_date ASC
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
      title,
      description,
      location,
      project_date
    FROM service_projects
    WHERE organization_id = $1
    ORDER BY project_date;
  `;
  
  const query_params = [organizationId];
  const result = await db.query(query, query_params);

  return result.rows;
};


const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      service_projects.project_id,
      service_projects.title,
      service_projects.description,
      service_projects.project_date AS date,
      service_projects.location,
      service_projects.organization_id,
      organization.name AS organization_name 
    FROM service_projects
    JOIN organization ON service_projects.organization_id = organization.organization_id
    WHERE service_projects.project_date >= CURRENT_DATE
    ORDER BY service_projects.project_date ASC
    LIMIT $1;
  `;

  const query_params = [number_of_projects];
  const result = await db.query(query, query_params);
  return result.rows;
};

const getProjectDetails = async (Id) => {
  const query = `
    SELECT
      service_projects.project_id,
      service_projects.title,
      service_projects.description,
      service_projects.project_date AS date,
      service_projects.location,
      service_projects.organization_id,
      organization.name AS organization_name 
    FROM service_projects
    InnER JOIN organization ON service_projects.organization_id = organization.organization_id
    WHERE service_projects.project_id = $1;
  `;

  const result = await db.query(query, [Id]);
  return result.rows[0];

};

const createProject = async (title, description, location, project_date, organization_id) => {
  const query = `
    INSERT INTO service_projects (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const result = await db.query(query, [title, description, location, project_date, organization_id]);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
  
};

const getCategoriesByServiceProjectId = async (projectId) => {
  const query = `
    SELECT 
      categories.category_id, 
      categories.category_name
    FROM categories
    INNER JOIN project_categories 
      ON categories.category_id = project_categories.category_id
    WHERE project_categories.project_id = $1;
  `;

  // DEBUG: Check what ID is being sent to the database
  console.log("Fetching categories for Project ID:", projectId);

  const result = await db.query(query, [projectId]);

  // DEBUG: Check what the database actually returned
  console.log("Database returned:", result.rows);

  return result.rows;
};

// const updateCategoryAssignments = async (projectId, categoryIds) => {
//   // 1. First, remove all existing category assignments
//   const deleteQuery = `DELETE FROM project_categories WHERE project_id = $1;`;
//   await db.query(deleteQuery, [projectId]);

//   // 2. ONLY run the insert if the array is not empty
//   if (categoryIds && categoryIds.length > 0) {
//     const insertQuery = `
//       INSERT INTO project_categories (project_id, category_id)
//       VALUES ${categoryIds.map((id, index) => `($1, $${index + 2})`).join(', ')};
//     `;
//     const queryValues = [projectId, ...categoryIds];
//     await db.query(insertQuery, queryValues);
//   }
  
//   // If the array was empty, the function simply finishes after the DELETE,
//   // which is exactly what you want (removing all categories).
// };

const updateProject = async (projectId, title, description, location, project_date, organizationId) => {
  const query = `
    UPDATE service_projects
    SET 
        title = $1, 
        description = $2, 
        location = $3, 
        project_date = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  // Array order: $1=title, $2=desc, $3=loc, $4=date, $5=org, $6=id
  const result = await db.query(query, [
    title, 
    description, 
    location, 
    project_date, 
    organizationId, 
    projectId
  ]);

  if (result.rows.length === 0) {
    throw new Error('No project found with that ID');
  }

  return result.rows[0].project_id;
};

// Export the model functions
export { 
  getAllProjects, 
  getProjectsByOrganizationId, 
  getUpcomingProjects, 
  getProjectDetails, 
  createProject,
  getCategoriesByServiceProjectId,
  updateProject
};