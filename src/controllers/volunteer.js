import { 
    addVolunteer, 
    removeVolunteer 
} from "../models/volunteer.js";

/* *****************************
 * Process Volunteering (POST)
 * URL: /volunteer/add/:projectId
 * *****************************/
const processAddVolunteer = async (req, res) => {
    const projectId = req.params.projectId;
    // Defensive check: ensure user exists in res.locals
    const userId = res.locals.user ? res.locals.user.user_id : null; 

    if (!userId) {
        req.flash('error', 'Please log in to volunteer.');
        return res.redirect('/account/login');
    }

    try {
        // Calling the imported function directly
        await addVolunteer(userId, projectId);
        req.flash('success', 'You are now a volunteer for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Controller Error (Add): " + error);
        req.flash('error', 'Failed to sign up.');
        res.redirect(`/project/${projectId}`);
    }
};

/* *****************************
 * Process Removal (POST)
 * URL: /volunteer/remove/:projectId
 * *****************************/
const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = res.locals.user ? res.locals.user.user_id : null;
    const source = req.body.source; 

    if (!userId) {
        return res.redirect('/dashboard');
    }

    try {
        // Calling the imported function directly
        await removeVolunteer(userId, projectId);
        req.flash('success', 'Volunteer status removed.');
        
        // Redirect logic: back to account if cancelled from dashboard
        if (source === 'dashboard') {
            return res.redirect('/dashboard');
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Controller Error (Remove): " + error);
        req.flash('error', 'Failed to remove volunteer status.');
        res.redirect('/dashboard');
    }
};

export {
    processAddVolunteer,
    processRemoveVolunteer
};