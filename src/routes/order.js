import express from "express";
import { getOrders, getOrderDetail, assignCarton } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderDetail);
router.post("/carton", assignCarton);

export default router;