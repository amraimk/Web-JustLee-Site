import { getConnection } from "../oracle.js";
import oracledb from "oracledb";

//get count of Authors
export async function getAuthorCount() {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN sp_count_authors(:author_total); END;`,
      {
        author_total: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );
    return result.outBinds.author_total;

  } catch (err) {
    console.error("Error fetching author count:", err);
  } finally {
    if (connection) await connection.close();
  }
}

// Get all authors
export async function getAllAuthors() {
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN SP_GET_ALL_AUTHOR(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();  // Get all rows
    await cursor.close();

    return rows;
  } catch (err) {
    console.error("Error fetching authors:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
};


// Delete an author by ID
export async function deleteAuthor(authorId) {
  let connection;

  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN SP_DELETE_AUTHOR(:authorId); END;`,
      { authorId },
      { autoCommit: true }
    );

    return { message: "Author deleted successfully!" };

  } catch (err) {
    console.error("Error deleting author:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
}

// Update author details by ID
export async function updateAuthor(AUTHORID, FNAME, LNAME) {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN SP_UPDATE_AUTHOR(:AUTHORID, :FNAME, :LNAME); END;`,
      {
        AUTHORID,
        FNAME,
        LNAME
      },
      { autoCommit: true }
    );
    return { message: "Author updated successfully!" };
  } catch (err) {
    console.error("Error updating author:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
};

// Register new author
export async function addAuthor(author) {
  let connection;

  try {
    connection = await getConnection();
    const { AUTHORID, FNAME, LNAME } = author;

    await connection.execute(
      `BEGIN SP_REGISTER_AUTHOR(
          :AUTHORID,
          :FNAME,
          :LNAME);
       END;`,
      {
        AUTHORID: AUTHORID,
        FNAME: FNAME,
        LNAME: LNAME
      },
      { autoCommit: true }
    );

    return { message: "Author registered successfully!" };

  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

// Assign author to a book
export async function assignAuthorToBook(isbn, authorId) {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN SP_ASSIGN_BOOK_AUTHOR(:isbn, :authorId); END;`,
      {
        isbn,
        authorId
      },
      { autoCommit: true }
    );

    return { message: "Author is assigned to the book successfully!" };

  } finally {
    if (connection) await connection.close();
  }
};

// Get assigned authors books
export async function getAssignedAuthorsBooks() {
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      `BEGIN SP_GET_BOOK_AUTHOR(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } }
    );

    const cursor = result.outBinds.cursor;
    const rows = await cursor.getRows();  // Get all rows
    await cursor.close();

    return rows;
  } catch (err) {
    console.error("Error fetching assigned authors books:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
};

// Delete assigned author and book
export async function deleteAssignedAuthorBook(isbn, authorId) {
  let connection;

  try {
    connection = await getConnection();
    await connection.execute(
      `BEGIN SP_DELETE_AUTHOR_BOOK(:isbn, :authorId); END;`,
      { isbn, authorId },
      { autoCommit: true }
    );

    return { message: "Assigned author and book deleted successfully!" };

  } catch (err) {
    console.error("Error deleting record:", err);
    throw err;
  } finally {
    if (connection) await connection.close();
  }
}