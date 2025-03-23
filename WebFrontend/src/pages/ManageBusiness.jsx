/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/ManageBusiness.css";
import axios from "axios";
import Swal from "sweetalert2";

const ManageBusiness = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check for user and redirect if not valid
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      navigate("/sign-in");
    } else if (!user.is_verified) {
      Swal.fire({
        title: "Not Signed In",
        text: "Please confirm your user email and sign in again.",
        icon: "warning",
        confirmButtonText: "Okay",
      }).then(() => {
        navigate("/sign-in");
      });
    } else {
      setUser(user);
    }
  }, [navigate]);

  // Fetch businesses from the API once the user is set
  useEffect(() => {
    if (!user) return; // Wait until user is available

    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        // Send username in the POST request payload
        const response = await axios.post(
          "/api/business-user-relation/get-businesses",
          { username: user.username }
        );

        if (response.data.success) {
          // Filter only verified businesses before setting the state
          const verifiedBusinesses = response.data.data.filter(
            (business) => business.is_verified
          );
          setBusinesses(verifiedBusinesses);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch businesses"
          );
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [user]);

  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter((businessRelation) => {
    const businessName = businessRelation.business.name;
    return (
      businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      businessRelation.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleNavigateToBusinessDashboard = (businessId) => {
    navigate(`/business-dashboard/${businessId}`);
  };

  const handleNavigateToReservationDashboard = (businessId) => {
    navigate(`/reservation-dashboard/${businessId}`);
  };

  const handleRegisterBusiness = () => {
    navigate("/business-registration");
  };

  const handleJoinBusiness = () => {
    navigate("/business-join");
  };

  const handleViewAccount = () => {
    navigate("/user-profile");
  };

  if (isLoading) {
    return (
      <div className="manage-business-container loading">
        <div className="loading-spinner"></div>
        <p>Loading businesses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-business-container error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

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
        <button
          onClick={handleRegisterBusiness}
          className="action-button register"
        >
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
        {filteredBusinesses.length > 0 ? (
          <table className="businesses-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Relation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((relation) => (
                <tr key={relation.id}>
                  <td>{relation.business.name}</td>
                  <td>{relation.type}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() =>
                        handleNavigateToReservationDashboard(
                          relation.business_id
                        )
                      }
                      className="dashboard-button"
                      title="Go to Dashboard"
                    >
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </button>
                    {(relation.type.toLowerCase() === "owner" ||
                      relation.type.toLowerCase() === "admin") && (
                      <button
                        onClick={() =>
                          handleNavigateToBusinessDashboard(
                            relation.business_id
                          )
                        }
                        className="details-button"
                        title="View Business Details"
                      >
                        View Business Details
                      </button>
                    )}
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
            <button
              onClick={handleRegisterBusiness}
              className="create-new-button"
            >
              Create New Business
            </button>
          </div>
        )}
      </div>

      <div className="quick-help">
        <h3>Need Help?</h3>
        <div className="help-links">
          <a href="/help/create-business">
            <i className="fas fa-plus-circle"></i> How to create a business
          </a>
          <a href="/help/join-business">
            <i className="fas fa-users"></i> How to join an existing business
          </a>
          <a href="/help/business-settings">
            <i className="fas fa-sliders-h"></i> Managing business settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default ManageBusiness;
