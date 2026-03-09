// import needed models
import { getAllOrganizations } from '../models/organization.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Export the controller function
export { showOrganizationsPage };