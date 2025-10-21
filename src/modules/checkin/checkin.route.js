import express from 'express';
import { checkinController } from './checkin.controller.js';
import { authenticateJWT, authorizeAdmin } from '../../../middlewares/auth.js';

const router = express.Router();

// GET semua riwayat checkin
router.get('/', authenticateJWT, authorizeAdmin, checkinController.getAllCheckins);

// POST untuk user checkin (via QR code)
router.post('/', checkinController.createCheckin);

export default router;
