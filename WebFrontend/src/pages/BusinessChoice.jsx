import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/BusinessChoice.css";  // Ensure the correct path to the CSS file

const RegistrationButtons = () => {
    const navigate = useNavigate();
    const [hoverRegister, setHoverRegister] = useState(false);
    const [hoverJoin, setHoverJoin] = useState(false);

    return (
        <div className="container">
            {/* Background with cosmic animations */}
            <div className="cosmic-background">
                <div className="stars"></div>
                <div className="twinkling"></div>
                <div className="clouds"></div>
            </div>

            {/* Main content */}
            <div className="content">
                <h1 className="title">Begin Your Journey</h1>
                <p className="subtitle">Unlock a world of possibilities</p>

                {/* Button container */}
                <div className="buttons-container">
                    {/* Register Button */}
                    <button
                        className={`btn register-btn ${hoverRegister ? 'hover' : ''}`}
                        onMouseEnter={() => setHoverRegister(true)}
                        onMouseLeave={() => setHoverRegister(false)}
                        onClick={() => navigate('/business-registration')}
                    >
                        <span className="btn-content">Register</span>
                        <span className="btn-glitch"></span>
                        <span className="btn-label">Create your business profile</span>

                        {/* Particles effect on hover */}
                        {hoverRegister && (
                            <div className="particle-container">
                                {[...Array(15)].map((_, i) => (
                                    <div key={i} className="particle"></div>
                                ))}
                            </div>
                        )}
                    </button>

                    {/* Join Button */}
                    <button
                        className={`btn join-btn ${hoverJoin ? 'hover' : ''}`}
                        onMouseEnter={() => setHoverJoin(true)}
                        onMouseLeave={() => setHoverJoin(false)}
                        onClick={() => navigate('/join')}
                    >
                        <span className="btn-content">Join</span>
                        <span className="btn-pulse"></span>
                        <span className="btn-label">Start accepting reservations</span>

                        {/* Ripple effect on hover */}
                        {hoverJoin && (
                            <div className="ripple-container">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="ripple"></div>
                                ))}
                            </div>
                        )}

                        {/* Orbit effect on hover */}
                        {hoverJoin && (
                            <div className="orbit-container">
                                <div className="orbit">
                                    <div className="orbit-dot"></div>
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationButtons;