import request from 'supertest';
import { app } from '../app';

describe('User Endpoints', () => {
    
    describe('POST /api/v1/users/no-phone', () => {
        it('should create a new user without phone verification', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/users/no-phone')
                .send(userData);


            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'User created successfully');
            expect(response.body).toHaveProperty('token');
        });

        it('should return 400 if user already exists', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };
            
            await request(app)
                .post('/api/v1/users/no-phone')
                .send(userData);

            const response = await request(app)
                .post('/api/v1/users/no-phone')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/v1/users/login', () => {
        beforeEach(async () => {
            
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };
            await request(app)
                .post('/api/v1/users/no-phone')
                .send(userData);
        });

        it('should login successfully with correct credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'User logged in successfully');
            expect(response.body).toHaveProperty('token');
        });

        it('should return 400 with incorrect password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post('/api/v1/users/login')
                .send(loginData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid input');
        });
    });
}); 