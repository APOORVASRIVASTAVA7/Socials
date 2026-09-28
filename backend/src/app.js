import 'dotenv/config';
import express from 'express';
const app = express();
app.use(express.json());

app.get('/', (res,req) => {
    res.send('Hello!');
});

export default app;

