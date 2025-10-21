import express from 'express';
import { authController } from './auth.controller.js';

const router = express.Router();

router.post('/', authController.login);

export default router;
