import React from 'react';
import "../style/About.css";
import { FiSearch, FiPlus } from 'react-icons/fi';

const Slotzi = () => {
    return (
        <div className="app-container">
            <div className="diagonal-bg"></div>

            <header className="header">
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
                                <img className="icon" src="../assets/images/icon.png" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="category-card">
                        <h2 className="category-title">Meeting Room</h2>
                        <div className="category-divider"></div>
                        <div className="icon-circle">
                            <div className="category-icon">
                                <img className="icon" src="../assets/images/icon.png" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="category-card">
                        <h2 className="category-title">Customer Care Center</h2>
                        <div className="category-divider"></div>
                        <div className="icon-circle">
                            <div className="category-icon">
                                <img className="icon" src="../assets/images/icon.png" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="category-card">
                        <h2 className="category-title">Other</h2>
                        <div className="category-divider"></div>
                        <div className="icon-circle">
                            <img className="icon" src="../assets/images/icon.png" alt="" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Slotzi;