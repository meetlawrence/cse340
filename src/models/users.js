import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const query_params = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const query_params = [email];

    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const getAllUsers = async () => {
    const query = `
        SELECT
            users.user_id, 
            users.name,
            users.email,
            roles.role_name
        FROM users
        JOIN roles ON users.role_id = roles.role_id;
    `;
    
    const result = await db.query(query);
    return result.rows;
};

const getUserById = async (userId) => {
    const query = `
        SELECT users.user_id, users.name, users.email, roles.role_name 
        FROM users 
        JOIN roles ON users.role_id = roles.role_id
        WHERE users.user_id = $1; 
    `;

    const query_params = [userId];
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

const updateUserRole = async (userId, roleName) => {
    const query = `
        UPDATE users 
        SET role_id = (SELECT role_id FROM roles WHERE role_name = $2)
        WHERE user_id = $1
        RETURNING user_id;
    `;
    const params = [userId, roleName];
    const result = await db.query(query, params);
    return result.rows[0];
};

// The main authentication entry point
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    // If no user found, return null immediately
    if (!user) return null;

    // Verify the password (plain text vs stored hash)
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (isPasswordValid) {
        // Remove password_hash from the user object using destructuring
        const { password_hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }

    return null; // Password incorrect
};

export {
    createUser,
    authenticateUser,
    getAllUsers,
    getUserById,
    updateUserRole
};