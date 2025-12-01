import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ListAuthor() {
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/author', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch authors");
                }

                setAuthors(data);

            } catch (error) {
                console.error(`Error fetching authors: ${error.message}`);
                setError(error.message);
            }
        }
        fetchAuthors();
    }, []);

    const handleChange = (index, field, value) => {
        setAuthors(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    //update author
    const handleUpdate = async (author) => {

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        if (!author[1]) {
            alert("First name is required!");
            return;
        }

        const confirmUpdate = window.confirm(`Are you sure you want to update author ${author[0]}?`);
        if (!confirmUpdate) return;

        try {
            const response = await fetch(`http://localhost:5000/api/author/${author[0]}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    FNAME: author[1],
                    LNAME: author[2]
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update author");

            alert(data.message || "Author updated successfully!");
        } catch (err) {
            alert(err.message);
        }
    }

    //delete author
    const handleDelete = async (authorId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this author? \nThis will also remove any associated book assignments.");
        if (!confirmDelete) return;

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/author/${authorId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete author');
            }

            alert(data.message || 'Author deleted successfully!');
            setAuthors(prevAuthors => prevAuthors.filter(author => author[0] !== authorId));

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="table-section-page">
            <h1>Manage Authors</h1>

            {error && <p className="error-msg">{error}</p>}

            <div className="table-wrapper">
                {authors.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {authors.map((author, index) => (
                                <tr key={author[0]}>
                                    <td>{author[0]}</td>
                                    <td
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleChange(index, 1, e.target.innerText.trim())}
                                    >
                                        {author[1]}
                                    </td>
                                    <td
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleChange(index, 2, e.target.innerText.trim())}
                                    >
                                        {author[2]}
                                    </td>
                                    <td className="actions-cell">
                                        <div>
                                            <button className="primary" onClick={() => handleUpdate(author)}>Update</button>
                                            <button className="secondary" onClick={() => handleDelete(author[0])}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-state">No authors found</p>
                )}
            </div>
        </div>
    );
}
