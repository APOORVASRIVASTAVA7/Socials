// Database configuration - db connection file

import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, //I accidently wrote DB_HOST which caused this typo, your code is trying to use your host address (like localhost or 127.0.0.1) as the name of the database, causing your connection test to hit an error or force a premature exit.
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});



export default pool;
