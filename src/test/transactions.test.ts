import request from 'supertest';
import { app } from '../app';
import { usersData } from '../data';
import jwt from 'jsonwebtoken';

describe('Transaction Endpoints', () => {
    let senderToken: string;
    let recipientToken: string;

    beforeEach(() => {
        Object.keys(usersData).forEach(key => delete usersData[key]);

        const senderEmail = 'sender@example.com';
        const recipientEmail = 'recipient@example.com';
        const password = 'password123';

        usersData[senderEmail] = {
            email: senderEmail,
            password: password,
            balance: 1000,
            phone: '',
            transactions: []
        };

        usersData[recipientEmail] = {
            email: recipientEmail,
            password: password,
            balance: 0,
            phone: '',
            transactions: []
        };

        
        senderToken = jwt.sign({ userId: senderEmail }, process.env.JWT_SECRET!, { expiresIn: '2h' });
        recipientToken = jwt.sign({ userId: recipientEmail }, process.env.JWT_SECRET!, { expiresIn: '2h' });
    });

    describe('GET /api/v1/transactions', () => {
        it('should return user transactions when authenticated', async () => {
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
                amount: 100
            };

            const response = await request(app)
                .post('/api/v1/transactions')
                .set('Authorization', `Bearer ${senderToken}`)
                .send(transactionData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Transaction completed successfully');

            // Verify balances were updated
            expect(usersData['sender@example.com'].balance).toBe(900);
            expect(usersData['recipient@example.com'].balance).toBe(100);
        });

        it('should return 400 when amount exceeds balance', async () => {
            const transactionData = {
                recipientEmail: 'recipient@example.com',
                amount: 2000
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