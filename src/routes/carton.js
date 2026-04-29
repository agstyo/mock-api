import express from "express";
import { getCartons } from "../controllers/cartonController.js";

const router = express.Router();

router.get("/", getCartons);

export default router;