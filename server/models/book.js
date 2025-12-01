import { getConnection } from "../oracle.js";
import oracledb from "oracledb";


//get count of books
export async function getBookCount() {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN sp_count_books(:book_total); END;`,
      {
        book_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );
    return result.outBinds.book_total;

  } catch (err) {
    console.error("Error fetching book count:", err);
  } finally {
    if (connection) await connection.close();
  }
};

// Get all publishers for book registration form
export async function getPublishers() {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN SP_GET_PUBLISHER(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();  // Get all rows
    await cursor.close();

    return rows;
  } finally {
    if (connection) await connection.close();
  }
};

// Check if ISBN exists
export async function checkIsbn(isbn) {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN SP_CHECK_ISBN(:P_isbn, :isbn_exists); END;`,
      {
        P_isbn: isbn,
        isbn_exists: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );

    return result.outBinds.isbn_exists;
  } finally {
    await connection.close();
  }
};

// add a book
export async function addBook(book) {
  let connection;

  try {
    connection = await getConnection();
    const { ISBN, TITLE, PUBDATE, PUBID, COST, RETAIL, DISCOUNT, CATEGORY } = book;

    await connection.execute(
      `BEGIN SP_REGISTER_BOOK(
          :isbn,
          :title,
          :pubdate,
          :pubid,
          :cost,
          :retail,
          :discount,
          :category);
       END;`,
      {
        isbn: ISBN,
        title: TITLE,
        pubdate: PUBDATE,
        pubid: Number(PUBID),
        cost: Number(COST),
        retail: Number(RETAIL),
        discount: Number(DISCOUNT),
        category: CATEGORY
      },
      { autoCommit: true }
    );

    return { message: "Book registered successfully!" };

  } finally {
    if (connection) {
      await connection.close();
    }
  }
};


// Get all books
export async function getAllBooks() {
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN SP_GET_ALL_BOOKS(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();  // Get all rows
    await cursor.close();

    return rows;

  } catch (err) {
    console.error("Error fetching books:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
};

// Delete a book by ISBN
export async function deleteBook(isbn) {
 let connection;

  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN SP_DELETE_BOOK(:isbn); END;`,
      { isbn },
      { autoCommit: true }
    );

    return { message: "Book deleted successfully!" };

  } catch (err) {
    console.error("Error deleting book:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
}

// Update book details by ISBN
export async function updateBook(isbn, cost, retail) {
    let connection;
    try {
        connection = await getConnection();
        await connection.execute(
            `BEGIN SP_UPDATE_BOOK(:isbn, :cost, :retail); END;`,
            {
                isbn,
                cost,
                retail
            },
            { autoCommit: true }
        );
        return { message: "Book price updated successfully!" };
    } catch (err) {
        console.error("Error updating book price:", err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
};

