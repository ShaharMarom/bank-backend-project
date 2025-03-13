import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        let token: string | undefined;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } 

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            res.status(401).json({ message: 'Session expired' });
            return;
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};


