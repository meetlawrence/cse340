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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };