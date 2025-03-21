import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/ManageBusiness.css";

const ManageBusiness = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setBusinesses([
        { id: 1, name: "Coastal Cafe", type: "Restaurant", role: "Owner"},
        { id: 2, name: "Blue Ocean Spa", type: "Wellness", role: "Manager" },
        { id: 3, name: "Mountain Retreat", type: "Accommodation", role: "Owner" },
        { id: 4, name: "City Fitness", type: "Gym", role: "Admin" },
        { id: 5, name: "Tech Coworking", type: "Office Space", role: "Manager" },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredBusinesses = businesses.filter(business => 
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    business.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigateToDashboard = (businessId) => {
    navigate(`/dashboard/${businessId}`);
  };


  const handleRegisterBusiness = () => {
    navigate('/business-registration');
  };

  const handleJoinBusiness = () => {
    navigate('/business-join');
  };

  const handleViewAccount = () => {
    navigate('/account');
  };

  return (
    <div className="manage-business-container">
      <div className="header-section">
        <h1>Manage Your Businesses</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handleRegisterBusiness} className="action-button register">
          <i className="fas fa-file-signature"></i> Register
        </button>
        <button onClick={handleJoinBusiness} className="action-button join">
          <i className="fas fa-user-plus"></i> Join Business
        </button>
        <button onClick={handleViewAccount} className="action-button account">
          <i className="fas fa-user-circle"></i> Your Account
        </button>
      </div>

      <div className="businesses-table-container">
        {isLoading ? (
          <div className="loading-spinner">
            
          </div>
        ) : filteredBusinesses.length > 0 ? (
          <table className="businesses-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Type</th>
                <th>Your Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((business) => (
                <tr key={business.id}>
                  <td>{business.name}</td>
                  <td>{business.type}</td>
                  <td>{business.role}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleNavigateToDashboard(business.id)}
                      className="dashboard-button"
                      title="Go to Dashboard"
                    >
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </button>
                    <button className="edit-button" title="Edit Business">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="settings-button" title="Business Settings">
                      <i className="fas fa-cog"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h3>No businesses found</h3>
            <p>Try adjusting your search or create a new business</p>
            <button onClick={handleCreateBusiness} className="create-new-button">
              Create New Business
            </button>
          </div>
        )}
      </div>

      <div className="quick-help">
        <h3>Need Help?</h3>
        <div className="help-links">
          <a href="/help/create-business"><i className="fas fa-plus-circle"></i> How to create a business</a>
          <a href="/help/join-business"><i className="fas fa-users"></i> How to join an existing business</a>
          <a href="/help/business-settings"><i className="fas fa-sliders-h"></i> Managing business settings</a>
        </div>
      </div>
    </div>
  );
};

export default ManageBusiness;