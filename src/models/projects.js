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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject };