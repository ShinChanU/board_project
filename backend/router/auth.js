import express from 'express';
import * as AuthAPI from '../controllers/auth.js';

const authRouter = express.Router();

authRouter.post('/register', AuthAPI.register);
authRouter.post('/login', AuthAPI.login);
authRouter.post('/check', AuthAPI.check);
authRouter.post('/logout', AuthAPI.logout);

export default authRouter;
