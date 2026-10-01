import 'dotenv/config'; // 1. Always load environment variables first
// import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import cookieParser from 'cookie-parser';
import pool from './src/config/db.js';

// const app = express();
const PORT = process.env.PORT || 5000; // Hardcoded fallback to 5000 if env fails

// app.use(express.json());
// app.use(cookieParser());
app.use('/api/auth', authRoutes);

// 2. Start the server immediately so the event loop NEVER exits
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// 3. Run your database test query completely independently
pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection check failed: ", err);
    } else {
        console.log("DB connected successfully");
        console.log(result.rows);
    }
});
