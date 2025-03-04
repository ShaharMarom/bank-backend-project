import express from 'express';
import usersRouter from './routes/users';
import transactionsRouter from './routes/transactions';

const app = express();

app.use(express.json());
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/transactions', transactionsRouter);

export { app }; 