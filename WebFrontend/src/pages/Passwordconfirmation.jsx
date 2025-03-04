import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Passwordconfirmation.css";

const SignupWithPasswordConfirmation = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        nic: '',
        contactNumber: '',
        address: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordModalVisible, setPasswordModalVisible] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Signup data submitted:", formData);
        navigate("/waiting"); // Navigate to Waiting screen
    };

    const handlePasswordConfirm = (e) => {
        e.preventDefault();
        if (formData.password === formData.confirmPassword) {
            setPasswordModalVisible(false);
            console.log("Passwords match, proceeding with signup");
        } else {
            alert("Passwords do not match");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-background">
                <div className="blob blob1"></div>
                <div className="blob blob2"></div>
                <div className="blob blob3"></div>
            </div>
            <div className="signup-form-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h1 className="signup-title">Sign Up to <span className="brand-name">SlotZi</span></h1>

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label htmlFor="nic">NIC</label>
                            <input type="text" id="nic" name="nic" value={formData.nic} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="form-group half">
                            <label htmlFor="contactNumber">Contact Number</label>
                            <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="form-input" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="form-input" required />
                    </div>

                    <button type="submit" className="signup-button">Sign Up</button>
                </form>

                {passwordModalVisible && (
                    <div className="password-modal-overlay">
                        <div className="password-modal">
                            <form onSubmit={handlePasswordConfirm}>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-input" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-input" required />
                                </div>

                                <button type="submit" className="confirm-button">Confirm</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupWithPasswordConfirmation;
