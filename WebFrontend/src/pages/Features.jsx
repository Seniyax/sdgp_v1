import React from 'react';
import "../style/Features.css";

function Features() {
    return (
        <div className="features-container">
            <div className="features-bg">
                <nav className="navbar">
                    <div className="logo">
                        <div className="logo-text">SKIPQ</div>
                        <div className="logo-icon">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                    <ul className="nav-links">
                        <li>Home</li>
                        <li>Manage Slot</li>
                        <li>Reservations</li>
                        <li>Support</li>
                    </ul>
                    <div className="search-bar">
                        <input type="text" placeholder="Search" />
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.3015 19.0001L14.9585 14.6571" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="user-icon">
                        <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.5417 11.4C17.7327 11.4 20.3195 9.07187 20.3195 6.19998C20.3195 3.3281 17.7327 0.999985 14.5417 0.999985C11.3507 0.999985 8.76392 3.3281 8.76392 6.19998C8.76392 9.07187 11.3507 11.4 14.5417 11.4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Features;
