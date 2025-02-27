import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import usersRouter from './routes/users';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api/v1/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
