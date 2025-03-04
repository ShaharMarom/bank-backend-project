import { Request, RequestHandler } from 'express';
import { usersData } from '../data';
import jwt from 'jsonwebtoken';



export const listTransactions: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const user = usersData[(req as any).user.userId];
        
        res.status(200).json({ transactions: user.transactions });
        
    } catch (error) {
        next(error);
    }
};

export const createTransaction: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const decoded = (req as any).user;
        const sender = usersData[decoded.userId];
        if (!sender) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { recipientEmail, amount } = req.body;
        if (!recipientEmail || !amount) {
            res.status(400).json({ message: 'Missing input' });
            return;
        }

        const recipient = usersData[recipientEmail];
        if (!recipient) {
            res.status(400).json({ message: 'Recipient not found' });
            return;
        }

        if (amount <= 0) {
            res.status(400).json({ message: 'Invalid amount' });
            return;
        }

        if (amount > sender.balance) {
            res.status(400).json({ message: 'Insufficient balance' });
            return;
        }

        sender.balance -= amount;
        recipient.balance += amount;

        const transactionDate = new Date().toISOString();

        sender.transactions.push({
            date: transactionDate,
            type: 'sent',
            amount: -amount,
            account: recipientEmail
        });

        recipient.transactions.push({
            date: transactionDate,
            type: 'received',
            amount: amount,
            account: sender.email
        });

        res.status(200).json({ message: 'Transaction completed successfully' });
    } catch (error) {
        next(error);
    }
};

export const getTransaction: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const decoded = (req as any).user;
        const user = usersData[decoded.userId];
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { transactionId } = req.params;
        const transaction = user.transactions.find(t => t.date === transactionId);

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        res.status(200).json({ transaction });
    } catch (error) {
        next(error);
    }
}; 