import pool from '../config/db.js';

// const $1 = username;
// const $2 = email;

const userExists = async (username, email) => {
    const result = await pool.query(`
    SELECT username, email 
    FROM users 
    WHERE username =$1 OR email = $2`,
        [username, email]
    );
    return result.rows.length > 0; //T -> if 1 or more, F -> 0 
};

const createUser = async (username, email, password_hash) => {
    const result = await pool.query(`
       INSERT INTO users(username , email, password_hash)
       VALUES ($1, $2, $3)`,
        [username, email, password_hash]

    );
    return true;
};


const userExistsLogin = async (identifier) => {
    const result = await pool.query(`
    SELECT username, email , password_hash, user_id
    FROM users 
    WHERE username =$1 OR email = $1`,
        [identifier]
    );
    if (result.rows.length > 0) {
        const { password_hash, user_id } = result.rows[0];

        return { password_hash, user_id };
    }else{
        return null;
    }
};


export { userExists, createUser, userExistsLogin };