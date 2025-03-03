import React from "react";
import { Link } from "react-router-dom";
import "../style/Navbar.css";
import logo3 from "../assets/SlotZi1-removebg-preview.png";

const Navbar = () => {
    return (
        <nav className="navbar">
            <img src={logo3} alt="Logo" className="logo" />
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/testimonials">Testimonials</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
