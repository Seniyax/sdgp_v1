import React, { useState } from 'react';
import "../style/Signin.css";
import shape from "../assets/signin1.png";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login data submitted:', formData);
        // Add authentication logic here
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-shape">
                    <img src={shape} alt="shape" />
                </div>
                <div className="login-form-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h1 className="login-title">Sign In to <span className="brand-name">SlotZi</span></h1>
                        <div className="form-group">
                            <label htmlFor="emailOrUsername">Registered Email/ Username</label>
                            <input
                                type="text"
                                id="emailOrUsername"
                                name="emailOrUsername"
                                value={formData.emailOrUsername}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        

                        <div className="form-footer">
                            <div className="remember-me">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <label htmlFor="rememberMe">Remember</label>
                            </div>
                            <a href="/forgot-password" className="forgot-link">Forgotten?</a>
                        </div>

                        <button type="submit" className="login-button">Log in</button>

                        <div className="signup-prompt">
                            <p>Don't have an account?</p>
                            <a href="/signup" className="signup-link">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
