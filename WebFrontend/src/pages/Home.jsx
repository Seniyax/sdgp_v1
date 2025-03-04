import React from 'react';
import { useNavigate } from "react-router-dom";
import "../style/Home.css";
import video from "../assets/video.mov";
import feature1 from "../assets/menu.png";
import feature2 from "../assets/organization.png";
import feature3 from "../assets/reserve.png";
import feature4 from "../assets/seating.png";
import logo from "../assets/finallogo.png";
import { Instagram, Mail } from 'lucide-react';
import Button from '../components/Button.jsx'; // Import the Button component

const Home = () => {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="app-marketing">
            {/* Hero Section */}
            <div className="Hero-container">
                <div className="video-container">
                    <img src={video} alt="Promo Video" />
                </div>
                <div className="text-container">
                    <h1>SlotZi</h1>
                    <h3>Reservation Made Easy</h3>
                </div>
                <div className="button-container">
                    <Button text="Sign In" type="purple" onClick={() => navigate("/signin")} />
                    <Button text="Sign Up" type="black" onClick={() => navigate("/signup")} />
                </div>
            </div>

            {/* Logo and About Section */}
            <div className="logo-container">
                <div className="logo">
                    <img src={logo} alt="SlotZi Logo" />
                </div>
                <div className="logo-text">
                    <h1>SlotZi</h1>
                    <h3>Effortless reservations for restaurants and businesses. Book your slot with ease!</h3>
                </div>
            </div>

            {/* Features Section */}
            <div className="features-container">
                <div className="feature">
                    <div className="feature-image">
                        <img src={feature1} alt="Menu Feature" />
                    </div>
                    <div className="feature-text">
                        <h1>Menu</h1>
                        <h3>Browse restaurant menus before making a reservation.</h3>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-image">
                        <img src={feature2} alt="Organization Feature" />
                    </div>
                    <div className="feature-text">
                        <h1>Business Management</h1>
                        <h3>Seamless organization for business owners.</h3>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-image">
                        <img src={feature3} alt="Reservation Feature" />
                    </div>
                    <div className="feature-text">
                        <h1>Reservations</h1>
                        <h3>Book your time slots with ease.</h3>
                    </div>
                </div>
                <div className="feature">
                    <div className="feature-image">
                        <img src={feature4} alt="Seating Feature" />
                    </div>
                    <div className="feature-text">
                        <h1>Seating Plans</h1>
                        <h3>Choose your preferred seating arrangement.</h3>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src={logo} alt="SlotZi Logo" />
                        <h3>SlotZi</h3>
                    </div>
                    <p>&copy; 2025 SlotZi. All rights reserved.</p>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/slot_zi" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <Instagram size={20} />
                        </a>
                        <a href="mailto:slotzi@gmail.com" className="social-icon">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
