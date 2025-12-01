import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterBook() {

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Fetch publishers for dropdown
    const [publishers, setPublishers] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/api/book/publisher")
            .then(res => res.json())
            .then(data => setPublishers(data))
            .catch(err => console.error(err));
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }
    });


    // Handle form input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setBook((prev) => ({ ...prev, [id]: value }));
        setError("");
        setSuccess("");
    };


    // ISBN check
    const [isbn, setIsbn] = useState("");
    const [isbnStatus, setIsbnStatus] = useState("");

    const checkIsbn = async (value) => {
        setBook((prev) => ({ ...prev, ISBN: value }));
        setIsbn(value);

        if (value.length === 0) {
            setIsbnStatus("");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/book/check-isbn?isbn=${value}`);
            const data = await res.json();

            setIsbnStatus(data.exists ? "ISBN already exists" : "");
        } catch (error) {
            console.error("Error checking ISBN:", error);
        }
    };


    //Book registration
    const [book, setBook] = useState({
        ISBN: "",
        TITLE: "",
        PUBDATE: "",
        PUBID: "",
        COST: "",
        RETAIL: "",
        DISCOUNT: "",
        CATEGORY: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(book.ISBN)) {
            alert("ISBN must be exactly 10 digits.");
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/book/create-book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(book)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setTimeout(() => {
                    navigate('/book/list');
                }, 1500);

                // Reset form
                setBook({
                    ISBN: "",
                    TITLE: "",
                    PUBDATE: "",
                    PUBID: "",
                    COST: "",
                    RETAIL: "",
                    DISCOUNT: "",
                    CATEGORY: ""
                });
                setError("");
                setIsbnStatus("");

            } else {
                setError(data.error || "Failed to register book");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="register-book-form">
                <h2>Add a New Book</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <label htmlFor="ISBN">ISBN</label>
                        <input type="text" id="ISBN" placeholder="ISBN" value={book.ISBN} onChange={(e) => checkIsbn(e.target.value)} required />

                        <p className={`isbn-status ${isbnStatus.includes("exists") ? "exists" : "available"}`}>
                            {isbnStatus}
                        </p>
                    </div>

                    <label htmlFor="TITLE">Book Title</label>
                    <input type="text" id="TITLE" placeholder="Enter book title" value={book.TITLE} onChange={handleChange} required />

                    <label htmlFor="PUBDATE">Publication Date</label>
                    <input type="date" id="PUBDATE" value={book.PUBDATE} onChange={handleChange} required />

                    <label htmlFor="PUBID">Publisher ID</label>
                    <select id="PUBID" value={book.PUBID} onChange={handleChange} required>
                        <option value="">Select Publisher</option>
                        {publishers.map(pub => (
                            <option key={pub[0]} value={pub[0]}>
                                {pub[0]} - {pub[1]}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="COST">Cost</label>
                    <input type="number" id="COST" placeholder="Enter cost" value={book.COST} onChange={handleChange} required />

                    <label htmlFor="RETAIL">Retail Price</label>
                    <input type="number" id="RETAIL" placeholder="Enter retail price" value={book.RETAIL} onChange={handleChange} required />

                    <label htmlFor="DISCOUNT">Discount</label>
                    <input type="number" id="DISCOUNT" placeholder="Enter discount (optional)" value={book.DISCOUNT} onChange={handleChange} />

                    <label htmlFor="CATEGORY">Category</label>
                    <select id="CATEGORY" value={book.CATEGORY} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option>Fiction</option>
                        <option>Non-Fiction</option>
                        <option>Science</option>
                        <option>History</option>
                    </select>

                    <button className="primary" type="submit">Add Book</button>
                    <button className="secondary" type="reset">Cancel</button>

                    {error && <p className="error-msg">{error}</p>}
                    {success && <p className="success-msg">{success}</p>}
                </form>

            </div>
        </>
    );
}
