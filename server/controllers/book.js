import {
  getBookCount,
  getPublishers,
  addBook,
  checkIsbn,
  getAllBooks,
  deleteBook,
  updateBook
} from "../models/book.js";

// Get total book count
export async function bookCountController(req, res) {
  try {
    const totalBooks = await getBookCount();
    res.status(200).json({ totalBooks });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch book count" });
  }
};

// Get all publishers for book registration form
export async function fetchPublishers(req, res) {
  try {
    const publishers = await getPublishers();
    res.json(publishers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch publishers");
  }
};

// Check if ISBN exists
export async function checkISBN(req, res) {
  try {

    const { isbn } = req.query;

    if (!isbn) {
      return res.status(400).json("ISBN is required");
    }

    const existsValue = await checkIsbn(isbn);
    const exists = existsValue > 0;

    return res.status(200).json({
      exists,
      message: exists ? "ISBN already exists" : "ISBN available"
    });

  } catch (err) {
    console.error("ISBN check error:", err);
    return res.status(500).json({ message: "Server error while checking ISBN" });
  }
};

// Add new book
export async function createBook(req, res) {
  try {
    const result = await addBook(req.body);

    return res.status(201).json(result);
  } catch (error) {
    if (error.errorNum === 20001) {
      return res.status(400).json({ error: "ISBN already exists!" });
    }
    console.error("Book registration error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


// Get all books
export async function fetchAllBooks(req, res) {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Failed to fetch books: ${err.message}`);
  }
};

// Delete book
export async function removeBook(req, res) {
  try {
    const { isbn } = req.params;

    if (!isbn) {
      return res.status(400).json({ error: "ISBN is required" });
    }

    const result = await deleteBook(isbn);
    return res.status(200).json(result);

  } catch (err) {
    console.error("Server error deleting book:", err);
    return res.status(500).json({ error: "Server error while deleting book" });
  }
};

// Update book 
export async function updateBookbyID(req, res) {
  const { isbn } = req.params;
  const { COST, RETAIL } = req.body;

  if (!isbn || COST == null || RETAIL == null) {
    return res.status(400).json({ error: "ISBN, COST, and RETAIL are required" });
  }

  try {
    const result = await updateBook(isbn, COST, RETAIL);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Server error while updating book price" });
  }
};

