import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterAuthor() {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [author, setAuthor] = useState({
        AUTHORID: "",
        FNAME: "",
        LNAME: ""
    });

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }
    });


    const handleChange = (e) => {
        const { id, value } = e.target;
        setAuthor((prev) => ({ ...prev, [id]: value }));
        setError("");
        setSuccess("");
    };

    // Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/author/create-author", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(author)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setTimeout(() => {
                    navigate('/author/list');
                }, 1500);

                // Reset form after success
                setAuthor({ AUTHORID: "", FNAME: "", LNAME: "" });
                setError("");

            } else {
                setError(data.error || "Failed to register author");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong!");
        }
    };

    return (
        <div className="register-book-form">
            <h2>Add New Author</h2>

            <form onSubmit={handleSubmit}>
                <label>Author ID</label>
                <input
                    type="text"
                    id="AUTHORID"
                    placeholder="Enter Author ID"
                    value={author.AUTHORID}
                    onChange={handleChange}
                    required
                />

                <label>First Name</label>
                <input
                    type="text"
                    id="FNAME"
                    placeholder="Enter first name"
                    value={author.FNAME}
                    onChange={handleChange}
                    required
                />

                <label>Last Name</label>
                <input
                    type="text"
                    id="LNAME"
                    placeholder="Enter last name"
                    value={author.LNAME}
                    onChange={handleChange}
                />

                <button className="primary" type="submit">Add Author</button>
                <button className="secondary" type="reset">Cancel</button>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
            </form>
        </div>
    );
}
