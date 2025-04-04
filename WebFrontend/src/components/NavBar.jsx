/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/NavBar.css";
import defaultProfilePic from "../assets/default_profile_picture.png";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("business");
    navigate("/");
  };

  return (
    <nav className="navbar fixed-top">
      <div className="container-fluid">
        {/* Logo on the far right */}
        <div className="nav-logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        {/* Centered Links */}
        <div className="nav-center">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/manage-business" className="nav-link">
            Manage Businesses
          </Link>
          <Link to="/customer-support" className="nav-link">
            Support
          </Link>
          <a
            href="https://slotzi-marketing.vercel.app/"
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/user-profile">
                <div className="profile-pic">
                  <img
                    src={user?.profile_pic_url || defaultProfilePic}
                    alt="Profile"
                  />
                </div>
              </Link>
              <button
                className="nav-button logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/sign-in" style={{ textDecoration: "none" }}>
              <button className="nav-button sign-in-button">Sign In</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
