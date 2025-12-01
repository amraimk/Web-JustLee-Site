import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === "email") setEmail(value);
        if (id === "password") setPassword(value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            localStorage.setItem('token', data.token);
            if (setUser) {
                setUser(data.token);
            }
            navigate('/');

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Login</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                        value={email} onChange={handleChange}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        required
                        value={password} onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
