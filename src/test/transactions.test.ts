import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const User = require('../models/user');
const Transaction = require('../models/transaction');

describe('Transaction Endpoints', () => {
    let senderToken: string;
    let recipientToken: string;
    let senderId: string;
    let recipientId: string;

    beforeEach(async () => {
        const sender = await User.create({
            email: 'sender@example.com',
            password: 'password123',
            balance: 1000,
            phone: ''
        });
        senderId = sender._id;

        const recipient = await User.create({
            email: 'recipient@example.com',
            password: 'password123',
            balance: 0,
            phone: ''
        });
        recipientId = recipient._id;
        
        senderToken = jwt.sign({ userId: senderId }, process.env.JWT_SECRET!, { expiresIn: '2h' });
        recipientToken = jwt.sign({ userId: recipientId }, process.env.JWT_SECRET!, { expiresIn: '2h' });
    });

    describe('GET /api/v1/transactions', () => {
        it('should return user transactions when authenticated', async () => {
            await Transaction.create({
                sender: senderId,
                recipient: recipientId,
                amount: 100,
                type: 'transfer',
                user: senderId
            });

            const response = await request(app)
                .get('/api/v1/transactions')
                .set('Authorization', `Bearer ${senderToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('transactions');
            expect(Array.isArray(response.body.transactions)).toBe(true);
        });

        it('should return 401 when not authenticated', async () => {
            const response = await request(app)
                .get('/api/v1/transactions');

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Unauthorized');
        });
    });

    describe('POST /api/v1/transactions', () => {
        it('should create a transaction successfully', async () => {
            const transactionData = {
                recipientEmail: 'recipient@example.com',
                amount: 100,
                type: 'transfer'
            };

            const response = await request(app)
                .post('/api/v1/transactions')
                .set('Authorization', `Bearer ${senderToken}`)
                .send(transactionData);
            

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Transaction completed successfully');

            const updatedSender = await User.findById(senderId);
            const updatedRecipient = await User.findById(recipientId);
            expect(updatedSender.balance).toBe(900);
            expect(updatedRecipient.balance).toBe(100);

            const transaction = await Transaction.findById(response.body.transactionId);

            expect(transaction).toBeTruthy();
            expect(transaction.amount).toBe(100);
            expect(transaction.sender.toString()).toBe(senderId.toString());
            expect(transaction.recipient.toString()).toBe(recipientId.toString());
            expect(transaction.type).toBe('transfer');
        });

        it('should return 400 when amount exceeds balance', async () => {
            const transactionData = {
                recipientEmail: 'recipient@example.com',
                amount: 2000,
                type: 'transfer'
            };

            const response = await request(app)
                .post('/api/v1/transactions')
                .set('Authorization', `Bearer ${senderToken}`)
                .send(transactionData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Insufficient balance');
        });
    });
}); 