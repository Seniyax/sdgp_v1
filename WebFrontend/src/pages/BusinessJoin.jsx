/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/BusinessJoin.css";
import axios from "axios";
import Swal from "sweetalert2";

const BusinessJoin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

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

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [supervisorUsername, setSupervisorUsername] = useState("");
  const [role, setRole] = useState("Staff");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/business/get-all");
        setBusinesses(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    // Validate form
    setIsFormValid(selectedBusiness && supervisorUsername.trim().length > 0);
  }, [selectedBusiness, supervisorUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true); // Disable button while sending request

    try {
      const response = await axios.post(
        "/api/business-user-relation/create-business",
        {
          business_id: selectedBusiness,
          username: user.username,
          type: role,
          supervisor_username: supervisorUsername,
        }
      );

      if (!response) {
        throw new Error("Failed to join business");
      } else if (!response.data.success) {
        console.error("Failed to join business:", response.data.message);
      } else {
        Swal.fire({
          title: "Joining Business",
          text: "Please wait until the supervisor verifies your request.",
          icon: "warning",
          confirmButtonText: "Okay",
        }).then(() => {
          setSelectedBusiness("");
          setSupervisorUsername("");
          setRole("Staff");
          navigate("/manage-business");
        });
      }
    } catch (err) {
      console.error("Error joining business:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Re-enable button after request completes
    }
  };

  if (isLoading) {
    return (
      <div className="business-join-container loading">
        <div className="loading-spinner"></div>
        <p>Loading businesses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="business-join-container error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }
  return (
    <div className="business-join-container">
      <div className="join-card">
        <div className="join-header">
          <h1>Join a Business</h1>
          <p>Connect with your team and get started</p>
        </div>

        <form onSubmit={handleSubmit} className="join-form">
          <div className="form-group">
            <label htmlFor="business">Business Name</label>
            <div className="select-wrapper">
              <select
                id="business"
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a business
                </option>
                {businesses
                  .filter((business) => business.is_verified)
                  .map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="supervisor">Supervisor Username</label>
            <input
              type="text"
              id="supervisor"
              value={supervisorUsername}
              onChange={(e) => setSupervisorUsername(e.target.value)}
              placeholder="Enter your supervisor's username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <div className="role-select">
              <button
                type="button"
                className={role === "Admin" ? "active" : ""}
                onClick={() => setRole("Admin")}
              >
                Admin
              </button>
              <button
                type="button"
                className={role === "Staff" ? "active" : ""}
                onClick={() => setRole("Staff")}
              >
                Staff
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`join-button ${
              isFormValid && !isSubmitting ? "active" : "disabled"
            }`}
            disabled={!isFormValid || isSubmitting} // Disable if form is invalid or submitting
          >
            {isSubmitting ? "Sending request..." : "Join Business"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessJoin;
