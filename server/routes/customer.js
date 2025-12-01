import express from "express";
import authMiddleware from '../middleware/auth.js';
import {
fetchAllCustomersOrders,
customerCountController
} from "../controllers/customer.js";

const router = express.Router();


// Get all customers
router.get("/count", customerCountController);
router.get("/", authMiddleware, fetchAllCustomersOrders);

export default router;
