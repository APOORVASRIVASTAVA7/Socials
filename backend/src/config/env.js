import 'dotenv/config';
const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV,

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT || 5432,
};

export default env;