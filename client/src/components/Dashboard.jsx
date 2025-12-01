import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

    const navigate = useNavigate();
    const [counts, setCounts] = useState({
        totalBooks: null,
        authorCount: null,
        customerCount: null
    });

    const apiUrl = 'http://localhost:5000/api'; // Allow Cross-Origin requests if needed

    useEffect(() => {
        // Fetch books count
        fetch(`${apiUrl}/book/count`)
            .then(res => res.json())
            .then(data => {
                setCounts(prev => ({ ...prev, totalBooks: data.totalBooks }));
            })
            .catch(err => console.error(err));

        // Fetch authors count
        fetch(`${apiUrl}/author/count`)
            .then(res => res.json())
            .then(data => {
                setCounts(prev => ({ ...prev, authorCount: data.authorCount }));
            })
            .catch(err => console.error(err));

        // Fetch customers count
        fetch(`${apiUrl}/customer/count`)
            .then(res => res.json())
            .then(data => {
                setCounts(prev => ({ ...prev, customerCount: data.customerCount }));
            })
            .catch(err => console.error(err));

    }, []);


    return (
        <>
            <div class="container">
                <h2>JL Book Sales Dashboard</h2>

                <div class="cards">
                    <div class="card">
                        <h3>Total Books</h3>
                        <p>{counts ? counts.totalBooks : 'Loading...'}</p>
                    </div>
                    <div class="card">
                        <h3>Total Authors</h3>
                        <p>{counts ? counts.authorCount : 'Loading...'}</p>
                    </div>
                    <div class="card">
                        <h3>Total Customers</h3>
                        <p>{counts ? counts.customerCount : 'Loading...'}</p>
                    </div>
                </div>

                <div class="quick-links">
                    <button onClick={() => navigate("/book/registerbook")}>Register Book</button>
                    <button onClick={() => navigate("/author/register")}>Register Author</button>
                    <button onClick={() => navigate("/customer/list")}>View Customers</button>
                </div>
            </div>
        </>
    );
}