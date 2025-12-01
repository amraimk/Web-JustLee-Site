import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BooksList() {
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/book', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch books");
                }

                // Add $ sign for display only
                const formatted = data.map((book) => [
                    book[0], // ISBN
                    book[1], // TITLE
                    book[2], // PUBDATE
                    book[3], // PUBID
                    `$${book[4]}`, // COST
                    `$${book[5]}`, // RETAIL
                    book[6] != null ? `$${book[6]}` : "", // DISCOUNT
                    book[7], // CATEGORY
                ]);

                setBooks(formatted);

            } catch (error) {
                console.error(`Error fetching books: ${error.message}`);
                setError(error.message);
            }
        }

        fetchBooks();
    }, []);

    const handleDelete = async (isbn) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book? \nThis will also remove any associated author assignments.");
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/book/${isbn}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if (response.ok) {
                setBooks(prevBooks => prevBooks.filter(book => book[0] !== isbn));
                alert(data.message || 'Book deleted successfully!');
            } else {
                alert(data.error || 'Failed to delete book');
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    //update book
    const handleChange = (index, field, value) => {
        setBooks(prevBooks => {
            const updatedBooks = [...prevBooks];
            updatedBooks[index][field] = value;
            return updatedBooks;
        });
    }

    const handleUpdate = async (book) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        let cost = book[4]?.replace("$", "").trim();
        let retail = book[5]?.replace("$", "").trim();

        // Validations
        if (!cost) return alert("Cost is required!");
        if (!retail) return alert("Retail is required!");
        if (isNaN(cost)) return alert("Cost must be a number!");
        if (isNaN(retail)) return alert("Retail must be a number!");

        const confirmUpdate = window.confirm(`Are you sure you want to update book ${book[1]}?`);
        if (!confirmUpdate) return;

        try {
            const response = await fetch(`http://localhost:5000/api/book/${book[0]}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    COST: Number(cost),
                    RETAIL: Number(retail)
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update book');

            alert(data.message || 'Book updated successfully!');
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="table-section-page">
            <h1>Manage Books</h1>

            {error && <p className="error-msg">{error}</p>}
            <div className="table-wrapper">
                {books.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ISBN</th>
                                <th>Title</th>
                                <th>Publication Date</th>
                                <th>Publisher ID</th>
                                <th>Cost</th>
                                <th>Retail</th>
                                <th>Discount</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, index) => (
                                <tr key={book[0]}>
                                    <td>{book[0]}</td>
                                    <td>{book[1]}</td>
                                    <td>{new Date(book[2]).toLocaleDateString()}</td>
                                    <td>{book[3]}</td>
                                    <td contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleChange(index, 4, e.target.innerText.trim())}>{book[4]}</td>
                                    <td contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleChange(index, 5, e.target.innerText.trim())}>{book[5]}</td>
                                    <td>{book[6]}</td>
                                    <td>{book[7]}</td>
                                    <td className="actions-cell">
                                        <div>
                                            <button className="primary" onClick={() => handleUpdate(book)}>Update</button>
                                            <button className="secondary" onClick={() => handleDelete(book[0])}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-state">No books available</p>
                )}
            </div>
        </div>
    );
}
