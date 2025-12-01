import { response } from "express";
import {
  getAuthorCount,
  getAllAuthors,
  deleteAuthor,
  updateAuthor,
  addAuthor,
  assignAuthorToBook,
  getAssignedAuthorsBooks,
  deleteAssignedAuthorBook
} from "../models/author.js";


// Get total author count
export async function authorCountController(req, res) {
  try {
    const authorCount = await getAuthorCount();
    res.status(200).json({ authorCount });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch author count" });
  }
};


// Get all authors
export async function fetchAllAuthors(req, res) {
  try {
    const authors = await getAllAuthors();
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to fetch authors: ${err.message}`);
  }
};


// Delete author by ID
export async function removeAuthor(req, res) {
  try {
    const { authorId } = req.params;

    if (!authorId) {
      return res.status(400).json({ error: "Author ID is required" });
    }

    const result = await deleteAuthor(authorId);
    return res.status(200).json(result);

  } catch (err) {
    console.error("Server error deleting author:", err);
    return res.status(500).json({ error: "Server error while deleting author" });
  }
};

// Update author by ID 
export async function updateAuthorByID(req, res) {
  const { authorId } = req.params;
  const { FNAME, LNAME } = req.body;

  // return res.status(400).json({"Update request body:" : FNAME});

  if (!authorId || !FNAME) {
    return res.status(400).json({ error: "Author ID and first name are required" });
  }

  try {
    const result = await updateAuthor(authorId, FNAME, LNAME);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error while updating author" });
  }
};

// Add new author
export async function createAuthor(req, res) {
  try {
    const result = await addAuthor(req.body);
    res.status(201).json(result);

  } catch (error) {
    if (error.errorNum === 20001) {
      return res.status(400).json({ error: "ISBN already exists!" });
    }
    console.error("Failed to create author:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Assign author to book
export async function assignToBook(req, res) {
try {
    const { isbn, authorId } = req.body;

    if (!authorId || !isbn) {
      return res.status(400).json({ error: "Author ID and ISBN are required" });
    }
    
    const result = await assignAuthorToBook(isbn, authorId);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Assign author error:", error);
    if (error.errorNum === 20002) {
      return res.status(409).json({ error: "Author is already assigned to this book" });
    }

    return res.status(500).json({error: "Failed to assign author"});
  }
};

// Get all assigned authors books
export async function fetchAssignedAuthorsBooks(req, res) {
  try {
    const assignedauthors = await getAssignedAuthorsBooks();
    res.json(assignedauthors);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to fetch authors: ${err.message}`);
  }
};


// Delete author and book assignment
export async function removeAuthorBookAssignment(req, res) {
  try {
    const { isbn, authorId } = req.params;

    const result = await deleteAssignedAuthorBook(isbn, authorId);
    return res.status(200).json(result);

  } catch (err) {
    console.error("Server error deleting record:", err);
    return res.status(500).json({ error: "Server error while deleting record" });
  }
};