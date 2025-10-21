import express from 'express';
import userRoutes from '../modules/user/user.route.js';
import membershipRoutes from '../modules/membership/membership.route.js';
import checkinRoutes from '../modules/checkin/checkin.route.js';
import loginRoutes from "../modules/auth/auth.route.js"

const router = express.Router();

router.use('/users', userRoutes);
router.use('/memberships', membershipRoutes);
router.use('/checkins', checkinRoutes);
router.use('/login', loginRoutes);

export default router;
