import authRoutes from './routes/auth.route.js';
import errorHandler from './middleware/error-handler.js';
import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());

app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

export default app;

