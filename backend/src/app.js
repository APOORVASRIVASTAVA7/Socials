const app = express();
app.use(express.json());

app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);
app.use(errorHandler);

export default app;

