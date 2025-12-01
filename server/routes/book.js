import express from "express";
import authMiddleware from '../middleware/auth.js';
import {
  bookCountController,
  fetchPublishers,
  checkISBN,
  createBook,
  fetchAllBooks,
  removeBook,
  updateBookbyID
} from "../controllers/book.js";

const router = express.Router();

// CRUD routes
router.get("/check-isbn", checkISBN);
router.get("/count", bookCountController);
router.get("/publisher", fetchPublishers);
router.get("/", authMiddleware, fetchAllBooks);           
router.post("/create-book", authMiddleware, createBook);   
router.put("/:isbn", authMiddleware, updateBookbyID);            
router.delete("/:isbn", authMiddleware, removeBook);      


export default router;
