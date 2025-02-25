import React from 'react';
import "../style/About.css";
import { FiSearch, FiPlus } from 'react-icons/fi';

const Slotzi = () => {
    return (
        <div className="app-container">
            <div className="diagonal-bg"></div>

            <header className="header">


                <nav className="nav">
                    <a href="#" className="nav-item">Home</a>
                    <a href="#" className="nav-item">Manage Slot</a>
                    <a href="#" className="nav-item">Reservations</a>
                    <a href="#" className="nav-item">Support</a>
                </nav>

                <div className="search-container">
                    <input type="text" className="search-input" placeholder="Search" />
                    <FiSearch className="search-icon" />
                </div>
            </header>

            <main className="main-content">
                <h1 className="page-title">Choose Your System.</h1>
                <p className="subtitle">Can't find your category? Choose 'Other'</p>

                <div className="categories-container">
                    <div className="category-card">
                        <h2 className="category-title">Restaurants</h2>
                        <div className="category-divider"></div>
                        <div className="icon-circle">
                            <div className="category-icon">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 60C20 60 25 40 50 40C75 40 80 60 80 60" stroke="black" strokeWidth="2" />
                                    <path d="M35 40L50 25L65 40" stroke="black" strokeWidth="2" />
                                    <path d="M30 70L40 65M70 70L60 65" stroke="black" strokeWidth="2" />
                                    <circle cx="50" cy="55" r="10" stroke="black" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="category-card">
                        <h2 className="category-title">Meeting Room</h2>
                        <div className="category-divider"></div>
                        <div className="icon-circle">
                            <div className="category-icon">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="30" y="60" width="40" height="10" fill="black" />
                                    <circle cx="30" cy="40" r="10" fill="black" />
                                    <circle cx="50" cy="40" r="10" fill="black" />
                                    <circle cx="70" cy="40" r="10" fill="black" />
                                    <rect x="25" y="50" width="10" height="25" fill="black" />
                                    <rect x="45" y="50" width="10" height="25" fill="black" />
                                    <rect x="65" y="50" width="10" height="25" fill="black" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="category-card">
                        <h2 className="category-title">Customer Care Center</h2>
                        <div className="category-divider"></div>
                        <div className="icon-circle">
                            <div className="category-icon">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="50" cy="40" r="15" fill="black" />
                                    <rect x="35" y="55" width="30" height="20" fill="black" />
                                    <path d="M25 45C25 45 15 45 15 55C15 65 25 65 25 65" stroke="black" strokeWidth="5" />
                                    <path d="M75 45C75 45 85 45 85 55C85 65 75 65 75 65" stroke="black" strokeWidth="5" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="category-card">
                        <h2 className="category-title">Other</h2>
                        <div className="category-divider"></div>
                        <div className="icon-circle">
                            <div className="add-icon">
                                <FiPlus color="white" size={40} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Slotzi;