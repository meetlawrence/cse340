import db from './db.js';

/* *****************************
 * Add a volunteer to a project
 * *****************************/
async function addVolunteer(userId, projectId) {
    try {
        const sql = `
            INSERT INTO volunteers (user_id, project_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, project_id) DO NOTHING
            RETURNING *`;
        const result = await db.query(sql, [userId, projectId]);
        return result.rows[0];
    } catch (error) {
        console.error("model error: " + error);
        throw error;
    }
}

/* *****************************
 * Remove a volunteer from a project
 * *****************************/
async function removeVolunteer(userId, projectId) {
    try {
        const sql = `DELETE FROM volunteers WHERE user_id = $1 AND project_id = $2`;
        const result = await db.query(sql, [userId, projectId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("model error: " + error);
        throw error;
    }
}

/* *****************************
 * Get all projects for a specific user
 * *****************************/
async function getProjectsByUser(userId) {
    try {
        const sql = `
            SELECT sp.*, o.name AS organization_name 
            FROM service_projects sp
            JOIN volunteers v ON sp.project_id = v.project_id
            JOIN organization o ON sp.organization_id = o.organization_id
            WHERE v.user_id = $1
            ORDER BY sp.project_date ASC`;
        const result = await db.query(sql, [userId]);
        return result.rows;
    } catch (error) {
        console.error("model error: " + error);
        throw error;
    }
}

/* *****************************
 * Check if a user is already volunteering for a project
 * *****************************/
async function checkVolunteerStatus(userId, projectId) {
    try {
        const sql = `SELECT 1 FROM volunteers WHERE user_id = $1 AND project_id = $2`;
        const result = await db.query(sql, [userId, projectId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("model error: " + error);
        throw error;
    }
}

export {
    addVolunteer,
    removeVolunteer,
    getProjectsByUser,
    checkVolunteerStatus
};