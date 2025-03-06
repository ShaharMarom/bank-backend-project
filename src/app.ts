import express from 'express';
import usersRouter from './routes/users';
import transactionsRouter from './routes/transactions';
import mongoose from 'mongoose';


mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

const app = express();

app.use(express.json());
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/transactions', transactionsRouter);

export { app }; 