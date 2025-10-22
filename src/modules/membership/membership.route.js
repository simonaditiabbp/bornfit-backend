import express from "express";
import { membershipController } from "./membership.controller.js";
import { authenticateJWT, authorizeAdmin } from '../../../middlewares/auth.js';

const router = express.Router();

router.get("/", authenticateJWT, authorizeAdmin, membershipController.getAll);
router.get("/:id", authenticateJWT, authorizeAdmin, membershipController.getById);
// GET membership by userId
router.get("/user/:userId", authenticateJWT, authorizeAdmin, membershipController.getByUserId);
router.post("/", authenticateJWT, authorizeAdmin, membershipController.create);
router.put("/:id", authenticateJWT, authorizeAdmin, membershipController.update);
router.delete("/:id", authenticateJWT, authorizeAdmin, membershipController.delete);

export default router;
