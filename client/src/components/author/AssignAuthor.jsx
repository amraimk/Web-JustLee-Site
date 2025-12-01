import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AssignAuthor() {
    const [authors, setAuthorsList] = useState([]);
    const [books, setBooksList] = useState(([]));
    const [assignedAuthorsBooks, setAssignedAuthorsBooks] = useState([]);
    const navigate = useNavigate();

    const [selectedBook, setSelectedBook] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token"); // get token from storage

        fetch("http://localhost:5000/api/author", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // add bearer token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch authors");
                return res.json();
            })
            .then(data => setAuthorsList(data))
            .catch(err => console.error(err));
    }, []);



    useEffect(() => {
        const token = localStorage.getItem("token"); // get token from storage

        fetch("http://localhost:5000/api/book", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // add bearer token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch books");
                return res.json();
            })
            .then(data => setBooksList(data))
            .catch(err => console.error(err));
    }, []);



    const loadAssignedAuthors = () => {
        fetch("http://localhost:5000/api/author/assigned-authors-books")
            .then(res => res.json())
            .then(data => setAssignedAuthorsBooks(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        loadAssignedAuthors();
        // fetch("http://localhost:5000/api/author/assigned-authors-books")
        //     .then(res => res.json())
        //     .then(data => setAssignedAuthorsBooks(data))
        //     .catch(err => console.error(err));
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;

        if (id === "ISBN") setSelectedBook(value);
        if (id === "AUTHORID") setSelectedAuthor(value);
        setError("");
        setSuccess("");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        if (!selectedBook || !selectedAuthor) {
            setError("Both book and author must be selected.");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/author/assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    isbn: selectedBook,
                    authorId: selectedAuthor
                })
            })
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                loadAssignedAuthors();
                setSelectedBook("");
                setSelectedAuthor("");
            } else {
                alert(data.error || "Failed to assign author to book.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const removeAssignment = async (isbn, authorId) => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/api/author/${isbn}/${authorId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                loadAssignedAuthors();
            } else {
                alert(data.error || "Failed to remove assignment.");
            }

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="table-section-page">
                <h1>Assigned Authors</h1>

                <form onSubmit={handleSubmit}>
                    <div class="form-row">
                        <div>
                            <label for="bookSelect">Select Book (ISBN)</label>
                            <select id="ISBN" value={books.isbn} onChange={handleChange} required>
                                <option value="">Select Book</option>
                                {books.map(book => (
                                    <option key={book[0]} value={book[0]}>
                                        {book[0]} - {book[1]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label for="authorSelect">Select Author</label>
                            <select id="AUTHORID" value={authors.authorId} onChange={handleChange} required>
                                <option value="">Select Author</option>
                                {authors.map(author => (
                                    <option key={author[0]} value={author[0]}>
                                        {author[0]} - {author[1]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="primary">Assign</button>
                    <button type="reset" className="secondary">Cancel</button>
                </form>

                <div className="table-wrapper">
                    {assignedAuthorsBooks.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Book ISBN</th>
                                    <th>Book Title</th>
                                    <th>Author ID</th>
                                    <th>Author Name</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody id="assignedAuthors">
                                {assignedAuthorsBooks.map((assignAB, index) => (
                                    <tr key={assignAB[0]}>
                                        <td>{assignAB[0]}</td>
                                        <td>{assignAB[1]}</td>
                                        <td>{assignAB[2]}</td>
                                        <td>{assignAB[3] + " " + assignAB[4]}</td>
                                        <td><button className="secondary delete" onClick={() => removeAssignment(assignAB[0], assignAB[2])}>🗑️</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-state">No records found</p>
                    )}
                </div>
            </div>
        </>
    );
}