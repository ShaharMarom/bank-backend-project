import express, { Router } from 'express';
import { registerUser, verifyRegistration, loginUser, registerUserNoPhone } from '../controllers/users';
import { authenticateUser, isParamUserId } from '../middlewares/auth';
import { getBalance } from '../controllers/users';

const router: Router = express.Router();

router.post('/', registerUser);
router.post('/verification', verifyRegistration);
router.post('/login', loginUser);
router.post('/no-phone', registerUserNoPhone);
router.get('/balance/:userId', authenticateUser, isParamUserId, getBalance);

export default router;


