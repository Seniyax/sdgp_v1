/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/ManageBusiness.css";
import axios from "axios";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY || "fallback-secret-key";

const encodeBusinessId = (businessId) => {
  const encrypted = CryptoJS.AES.encrypt(
    businessId.toString(),
    secretKey
  ).toString();
  return encodeURIComponent(encrypted);
};

const ManageBusiness = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [floorplans, setFloorplans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Fetch businesses for the user
  useEffect(() => {
    if (!user) return;

    const fetchBusinesses = async () => {
      setIsLoading(true);
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 1500));
      try {
        const response = await axios.post(
          "api/business-user-relation/get-businesses",
          { username: user.username }
        );

        if (response.data.success) {
          setBusinesses(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch businesses"
          );
        }
      } catch (err) {
        if (
          err.response?.data?.message !==
          "No business relations found for the user"
        ) {
          setError(err.response?.data?.message || "An error occurred");
        }
      } finally {
        await delayPromise;
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, [user]);

  useEffect(() => {
    const fetchFloorplans = async () => {
      try {
        const response = await axios.get("/api/floor-plan/get-all");
        if (response.data.success) {
          setFloorplans(response.data.floorplans);
        }
      } catch (err) {
        console.error("Error fetching floorplans", err);
      }
    };

    fetchFloorplans();
  }, []);

  const filteredBusinesses = businesses.filter((relation) => {
    const businessName = relation.business.name;
    const matchesSearch =
      businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relation.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (!relation.is_verified) return true;

    if (relation.type.toLowerCase() === "owner") {
      return true;
    } else {
      return relation.business.is_verified;
    }
  });

  const handleBusinessDashboard = (businessId) => {
    navigate(`/business-dashboard/${encodeBusinessId(businessId)}`);
  };

  const handleReservationDashboard = (businessId) => {
    navigate(`/reservation-dashboard/${encodeBusinessId(businessId)}`);
  };

  const handleRegisterBusiness = () => {
    navigate("/business-registration");
  };

  const handleJoinBusiness = () => {
    navigate("/business-join");
  };

  const handleFloorplan = (businessId) => {
    navigate(`/floorplan-designer/${encodeBusinessId(businessId)}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
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
        <div className={"action-buttons"}>
          <button
            className={"action-button try-again"}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button className={"action-button home"} onClick={handleBack}>
            Go back to Home
          </button>
        </div>
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
          Register
        </button>
        <button onClick={handleJoinBusiness} className="action-button join">
          Join Business
        </button>
      </div>

      <div className="businesses-table-container">
        {filteredBusinesses.length > 0 ? (
          <table className="businesses-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Relation</th>
                <th>Status / Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((relation) => {
                const isComingSoon =
                  relation.business.category &&
                  relation.business.category.name.toLowerCase() !==
                    "restaurant";

                const isFloorplan = floorplans.some(
                  (fp) => fp.business_id === relation.business_id
                );

                let actionContent = null;
                const isOwner = relation.type.toLowerCase() === "owner";
                const isAdmin = relation.type.toLowerCase() === "admin";

                if (!relation.is_verified) {
                  actionContent = (
                    <span className="pending-message">
                      Waiting {relation.supervisor?.name || "Supervisor"} to
                      verify your join request.
                    </span>
                  );
                } else if (isOwner && !relation.business.is_verified) {
                  const primaryEmail =
                    relation.business.primary_email?.email_address ||
                    "your primary email";
                  actionContent = (
                    <span className="pending-message">
                      Please verify the verification email sent to{" "}
                      {primaryEmail}
                    </span>
                  );
                } else {
                  actionContent = (
                    <div className="button-group">
                      {!isComingSoon && isFloorplan && (
                        <button
                          onClick={() =>
                            handleReservationDashboard(relation.business_id)
                          }
                          className="dashboard-button"
                          title="Go to Dashboard"
                        >
                          Dashboard
                        </button>
                      )}
                      {!isComingSoon &&
                        (isOwner || isAdmin) &&
                        (isFloorplan ? (
                          <button
                            onClick={() =>
                              handleFloorplan(relation.business_id)
                            }
                            className="floorplan-button"
                          >
                            Update Floorplan
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleFloorplan(relation.business_id)
                            }
                            className="floorplan-button"
                          >
                            Create Floorplan
                          </button>
                        ))}
                      {isOwner && (
                        <button
                          onClick={() =>
                            handleBusinessDashboard(relation.business_id)
                          }
                          className="details-button"
                          title="View Business Details"
                        >
                          View Business Details
                        </button>
                      )}
                    </div>
                  );
                }

                const comingSoonMessage = isComingSoon
                  ? `${relation.business.category.name}s are coming soon`
                  : null;

                return (
                  <tr
                    key={relation.id}
                    className={
                      !relation.is_verified ||
                      (isOwner && !relation.business.is_verified)
                        ? "non-interactable"
                        : ""
                    }
                  >
                    <td>{relation.business.name}</td>
                    <td>{relation.type}</td>
                    <td className="actions-cell">
                      {actionContent}
                      {comingSoonMessage && (
                        <div className="coming-soon-message">
                          {comingSoonMessage}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
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
          <a href="/help/create-business">How to create a business</a>
          <a href="/help/join-business">How to join an existing business</a>
          <a href="/help/business-settings">Managing business settings</a>
        </div>
      </div>
    </div>
  );
};

export default ManageBusiness;
