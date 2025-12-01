import { Link, Outlet } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

export default function Layout({ user, handleLogout }) {
    const navigate = useNavigate();
    return (
        <>
            <div className="layout">
                <nav className="navbar">
                    <div className="brand">
                        <Link to="/">
                            <img src={logo} alt="Logo" />
                        </Link>
                    </div>

                    <ul className="nav-menu">
                        <li><Link to="/">Dashboard</Link></li>

                        <li className="dropdown">
                            <span>Book ▾</span>
                            <ul className="dropdown-menu">
                                <li><Link to="/book/registerbook">Register Book</Link></li>
                                <li><Link to="/book/list">Manage Books</Link></li>
                            </ul>
                        </li>

                        <li className="dropdown">
                            <span>Author ▾</span>
                            <ul className="dropdown-menu">
                                <li><Link to="/author/register">Register Author</Link></li>
                                <li><Link to="/author/assign">Assign Author to Book</Link></li>
                                <li><Link to="/author/list">Manage Authors</Link></li>
                            </ul>
                        </li>

                        <li><Link to="/customer/list">Customer</Link></li>

                        <li><Link to="/help">Help</Link></li>
                        {user ? (
                            <button className="btn-logout" onClick={() => { handleLogout(); navigate('/login'); }}>Logout</button>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </ul>
                </nav>

                <main>
                    <Outlet />
                </main>

                <footer class="company-footer">

                    <div class="footer-bottom">
                        <p>© 2025 JL Book Sales. All rights reserved.</p>
                        <div class="social-icons">
                            <a href="#">Facebook</a>
                            <a href="#">LinkedIn</a>
                            <a href="#">Twitter</a>
                            <a href="#">YouTube</a>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    )
}