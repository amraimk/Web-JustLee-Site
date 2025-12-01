import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import BookRegister from "./components/book/RegisterBook";
import ListBooks from "./components/book/ListBooks";
import ListAuthor from "./components/author/ListAuthor";
import RegisterAuthor from "./components/author/RegisterAuthor";
import AssignAuthor from "./components/author/AssignAuthor";
import ListCustomer from "./components/customer/ListCustomer";
import Login from "./components/Login";
import Help from "./components/Help";

const MainRouter = () => {

    const getUserFromStorage = () => {
        const token = localStorage.getItem("token") || null;
        return token;
    }

    const [user, setUser] = useState(getUserFromStorage());

    useEffect(() => {
        setUser(getUserFromStorage());
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout user={user} handleLogout={handleLogout} />} >
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/book/registerbook" element={<BookRegister />} />
                    <Route path="/book/list" element={<ListBooks />} />
                    <Route path="/author/list" element={<ListAuthor />} />
                    <Route path="/author/register" element={<RegisterAuthor />} />
                    <Route path="/author/assign" element={<AssignAuthor />} />
                    <Route path="/customer/list" element={<ListCustomer />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/help" element={<Help />} />
                </Route>
            </Routes>
        </>
    )
}

export default MainRouter;