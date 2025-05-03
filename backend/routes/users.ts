import { Router } from "express";
import {
	getUser,
	patchUser,
	getUserMetrics,
	createUserIfNotExists,
} from "../controllers/usersController";

const router = Router();

router.post("/", (req, res) => void createUserIfNotExists(req, res));
router.get("/:id", (req, res) => void getUser(req, res));
router.patch("/:id", (req, res) => void patchUser(req, res));
router.get("/:id/metrics", (req, res) => void getUserMetrics(req, res));

export default router;
