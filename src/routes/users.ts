import express, { Router } from 'express';
import { registerUser, verifyRegistration, loginUser } from '../controllers/users';

const router: Router = express.Router();

router.post('/', registerUser);
router.post('/verification', verifyRegistration);
router.post('/login', loginUser);

export default router;


