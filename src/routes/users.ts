import express, { Router } from 'express';
import { registerUser, verifyRegistration, loginUser, registerUserNoPhone } from '../controllers/users';

const router: Router = express.Router();

router.post('/', registerUser);
router.post('/verification', verifyRegistration);
router.post('/login', loginUser);
router.post('/no-phone', registerUserNoPhone);

export default router;


