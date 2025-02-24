import React from "react";
import "../style/Navbar.css";

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
                <li>
                    <a href="#" className="text-white hover:text-gray-300">Home</a>
                </li>
                <li>
                    <a href="#" className="text-white hover:text-gray-300">About</a>
                </li>
                <li>
                    <a href="#" className="text-white hover:text-gray-300">Services</a>
                </li>
                <li>
                    <a href="#" className="text-white hover:text-gray-300">Contact</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
