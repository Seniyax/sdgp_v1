import React from "react";
import "../style/Waiting.css";

const Waiting = () => {
    return (
        <div className="container">
            <div className="signup-card">
                <h2 className="title">
                    Sign Up to <span className="brand">SlotZi</span>
                </h2>
                <div className="form">
                    <input type="text" placeholder="Full Name" disabled />
                    <input type="email" placeholder="Email" disabled />
                    <div className="row">
                        <input type="text" placeholder="NIC" disabled />
                        <input type="text" placeholder="Contact Number" disabled />
                    </div>
                    <input type="text" placeholder="Address" disabled />
                    <input type="text" placeholder="Username" disabled />
                    <button className="signup-btn" disabled>Sign Up</button>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Waiting for email verification. Please check your inbox.</p>
                </div>
            </div>
        </div>
    );
};

export default Waiting;
