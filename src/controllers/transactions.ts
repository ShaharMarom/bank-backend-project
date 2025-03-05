import { RequestHandler } from 'express';
import { usersData } from '../data';

const User = require('../models/user');
const Transaction = require('../models/transaction');


export const listTransactions: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const user = await User.findById((req as any).user.userId);
        
        res.status(200).json({ transactions: user.transactions });
        
    } catch (error) {
        next(error);
    }
};

export const createTransaction: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        
        const { recipientEmail, amount } = req.body;
        if (!recipientEmail || !amount) {
            res.status(400).json({ message: 'Missing input' });
            return;
        }
        
        if (amount <= 0) {
            res.status(400).json({ message: 'Invalid amount' });
            return;
        }
        
        const sender = await User.findById((req as any).user.userId);
        if (!sender) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (amount > sender.balance) {
            res.status(400).json({ message: 'Insufficient balance' });
            return;
        }
        
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            res.status(400).json({ message: 'Recipient not found' });
            return;
        }

        const transaction = await Transaction.create({
            sender: sender._id,
            recipient: recipient._id,
            amount: amount,
            type: 'transfer'
        });
        
        await User.findByIdAndUpdate(sender._id, { balance: sender.balance - amount, transactions: [...sender.transactions, transaction._id] });
        await User.findByIdAndUpdate(recipient._id, { balance: recipient.balance + amount, transactions: [...recipient.transactions, transaction._id] });


        res.status(200).json({ message: 'Transaction completed successfully', transactionId: transaction._id });
    } catch (error) {
        next(error);
    }
};

export const getTransaction: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const decoded = (req as any).user;
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { transactionId } = req.params;
        const transaction = user.transactions.find((transaction: any) => transaction._id.toString() === transactionId);

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        res.status(200).json({ transaction });
    } catch (error) {
        next(error);
    }
}; 