import express from "express";
import authMiddleware from '../middleware/auth.js';
import {
  fetchAllAuthors,
  removeAuthor,
  updateAuthorByID,
  createAuthor,
  assignToBook,
  fetchAssignedAuthorsBooks,
  authorCountController,
  removeAuthorBookAssignment
} from "../controllers/author.js";

const router = express.Router();

// CRUD routes
router.get("/count", authorCountController);
router.get("/", authMiddleware, fetchAllAuthors);
router.put("/:authorId", authMiddleware, updateAuthorByID);
router.delete("/:authorId", authMiddleware, removeAuthor);
router.post("/create-author", authMiddleware, createAuthor);
router.post("/assign", authMiddleware, assignToBook);
router.get("/assigned-authors-books", fetchAssignedAuthorsBooks);
router.delete("/:isbn/:authorId", authMiddleware, removeAuthorBookAssignment); 

export default router;
