import React from "react";
import { Link } from "react-router-dom";
import "../style/Navbar.css";
import logo3 from "../assets/finallogo.png";

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src={logo3} alt="Logo" className="logo" />
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/password-verification">Password Verification</Link></li>
                <li><Link to="/business-form">Business Form</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
