import { RequestHandler } from 'express';
import { usersData } from '../data';
import twilio from 'twilio';
import { createClient } from 'redis';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const twilioClient = twilio(accountSid, authToken);

export const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect();

const VERIFICATION_EXPIRATION = 60 * 5;
const SALT_ROUNDS = 10;

function generateRandomBalance() {
    return Math.floor(Math.random() * 1000000);
}

function generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '2h' });
}

async function createVerification(phone: string) {
    const verification = await twilioClient.verify.v2
        .services(serviceSid!)
        .verifications.create({
            channel: "sms",
            to: phone,
        });
    
    return verification;
}

async function verifyPhone(phone: string, code: string) {
    const verification = await twilioClient.verify.v2
        .services(serviceSid!)
        .verificationChecks.create({
            to: phone,
            code: code,
        });

    return verification;
}   

export const registerUserNoPhone: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Missing input' });
            return;
        }
        
        if (usersData[email]) { 
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        
        usersData[email] = { email, password: await bcrypt.hash(password, SALT_ROUNDS), balance: generateRandomBalance(), phone: '', transactions: [] };
        
        const token = generateToken(email);
        
        res.status(200).json({ 
            message: 'User created successfully',
            token: token
        });
        
    } catch (error) {
        next(error);
    }
    
}

export const registerUser: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { email, password, phone } = req.body;
        if (!email || !password || !phone) {
            res.status(400).json({ message: 'Missing input' });
            return;
        }
        if (usersData[email]) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        
        await createVerification(phone);

        redisClient.set(phone, JSON.stringify({ phone, email, password: await bcrypt.hash(password, SALT_ROUNDS) }), { EX: VERIFICATION_EXPIRATION });
        
        res.status(201).json({ message: 'Confirmation code sent' });
    } catch (error) {
        next(error);
    }
};

export const verifyRegistration: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) {
            res.status(400).json({ message: 'Missing input' });
            return;
        }

        const userData = await redisClient.get(phone);
        if (!userData) {
            res.status(400).json({ message: 'Registration data not found' });
            return;
        }

        const verification = await verifyPhone(phone, code);

        if (verification.status === 'approved') {
            const user = JSON.parse(userData);
            usersData[user.email] = { email: user.email, password: user.password, balance: generateRandomBalance(), phone: user.phone, transactions: [] };

            redisClient.del(phone);
            
            const token = generateToken(user.email);
        
            res.status(200).json({ 
                message: 'User created successfully',
                token: token
            });
        } else {
            res.status(400).json({ message: 'Invalid code' });
        }
    } catch (error) {
        next(error);
    }
};

export const loginUser: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Missing input' });
            return;
        }   

        const user = usersData[email];
        if (!user) {
            res.status(400).json({ message: 'Invalid input' });
            return;
        }   

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid input' });
            return;
        }
        
        const token = generateToken(user.email);
        
        res.status(200).json({ 
            message: 'User logged in successfully',
            token: token
        });
        
    } catch (error) {
        next(error);
    }
};
