import React from 'react';

const UserProfile = ({ userData = {} }) => {
  
  const {
    name = "Jane Smith",
    role = "Business Owner",
    email = "jane@example.com",
    phone = "(94) 71 667 2616",
    businessName = "Burley's Burgers",
    businessType = "Restaurant",
    memberSince = "January 2023",
    avatar = "/api/placeholder/150/150",
    stats = {
      reservationsToday: 12,
      reservationsWeek: 78,
      reservationsMonth: 312,
      completionRate: 96
    }
  } = userData;

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
          <p className="profile-role">{role} at {businessName}</p>
          <p className="profile-member">Member since {memberSince}</p>
          <div className="profile-contact">
            <div>
              <i className="icon-email"></i> {email}
            </div>
            <div>
              <i className="icon-phone"></i> {phone}
            </div>
          </div>
        </div>
        <button className="edit-profile-btn">
          <i className="icon-edit"></i> Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <nav className="profile-nav">
            <ul>
              <li className="active"><a href="#dashboard"><i className="icon-dashboard"></i> Dashboard</a></li>
              <li><a href="#manage-business" className="highlight-nav"><i className="icon-business"></i> Manage Business</a></li>
              <li><a href="#reservations"><i className="icon-calendar"></i> Reservations</a></li>
              <li><a href="#staff"><i className="icon-users"></i> Staff</a></li>
              <li><a href="#settings"><i className="icon-settings"></i> Settings</a></li>
            </ul>
          </nav>
        </div>

        <div className="profile-main">
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon reservations-today"></div>
              <div className="stat-content">
                <h3>Today's Reservations</h3>
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
    </div>
  );
};

export default UserProfile;