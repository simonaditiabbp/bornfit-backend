import express from 'express';
import { userController } from './user.controller.js';
import { authenticateJWT, authorizeAdmin } from '../../../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateJWT, authorizeAdmin, userController.getAllUsers);
router.get('/:id', authenticateJWT, authorizeAdmin, userController.getUserById);
router.post('/', authenticateJWT, authorizeAdmin, userController.createUser);
router.put('/:id', authenticateJWT, authorizeAdmin, userController.updateUser);

export default router;
