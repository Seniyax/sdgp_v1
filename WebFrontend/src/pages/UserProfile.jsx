/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) {
      navigate("/sign-in");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Destructure user properties with defaults.
  const {
    name = "Jane Smith",
    email = "jane@example.com",
    contact = "(94) 71 667 2616",
  } = user || {};

  // Additional defaults for profile view
  const role = user?.role || "Business Owner";
  const memberSince = user?.memberSince || "Member since unknown";
  const avatar = user?.avatar || "/api/placeholder/150/150";
  const stats = user?.stats || {
    reservationsToday: 0,
    reservationsWeek: 0,
    reservationsMonth: 0,
    completionRate: 0,
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={avatar} alt={`${name}'s avatar`} />
          <div className="avatar-upload">
            <i className="icon-camera"></i>
          </div>
        </div>
        <div className="profile-info">
          <h1>{name}</h1>
          <p className="profile-role">{role}</p>
          <p className="profile-member">Member since {memberSince}</p>
          <div className="profile-contact">
            <div>
              <i className="icon-email"></i> {email}
            </div>
            <div>
              <i className="icon-phone"></i> {contact}
            </div>
          </div>
        </div>
        <div className="profile-buttons">
          <button
            className="edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            <i className="icon-edit"></i> Edit Profile
          </button>
          <button
            className="manage-business-btn"
            onClick={() => navigate("/manage-business")}
          >
            Manage Business
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-icon reservations-today"></div>
            <div className="stat-content">
              <h3>Today&apos;s Reservations</h3>
              <p className="stat-number">{stats.reservationsToday}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon reservations-week"></div>
            <div className="stat-content">
              <h3>This Week</h3>
              <p className="stat-number">{stats.reservationsWeek}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon reservations-month"></div>
            <div className="stat-content">
              <h3>This Month</h3>
              <p className="stat-number">{stats.reservationsMonth}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completion-rate"></div>
            <div className="stat-content">
              <h3>Completion Rate</h3>
              <p className="stat-number">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
