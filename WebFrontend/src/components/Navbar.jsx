import React from 'react';
import { Link } from 'react-router-dom';
import "../style/Navbar.css";

function Navbar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/testimonials">Testimonials</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
        </nav>
    );
}

export default Navbar;
