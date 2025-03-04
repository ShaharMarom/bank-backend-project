import express, { Router } from 'express';
import { listTransactions, createTransaction, getTransaction } from '../controllers/transactions';
import { authenticateUser } from '../middlewares/auth';

const router: Router = express.Router();

router.get('/', authenticateUser, listTransactions);
router.post('/', authenticateUser, createTransaction);
router.get('/:transactionId', authenticateUser, getTransaction);

export default router; 