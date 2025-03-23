/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    email: "",
    address: "",
    contactNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (
        !formData.fullName ||
        !formData.nic ||
        !formData.email ||
        !formData.address
      ) {
        setError("Please fill in all required fields");
        return;
      }
    }
    setError("");
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError("");

    const payload = {
      name: formData.fullName,
      nic: formData.nic,
      email: formData.email,
      address: formData.address,
      contact: formData.contactNumber,
      username: formData.username,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    };

    try {
      const response = await axios.post("/api/user/sign-up", payload);
      if (response.data.success) {
        console.log("Signup successful", response.data);
        navigate("/sign-in");
      }
    } catch (err) {
      console.error("Signup error", err);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <div className="input-container">
          <i className="icon user-icon"></i>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nic">NIC</label>
        <div className="input-container">
          <i className="icon id-icon"></i>
          <input
            type="text"
            id="nic"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            placeholder="Enter your National ID number"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <div className="input-container">
          <i className="icon email-icon"></i>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <div className="input-container">
          <i className="icon address-icon"></i>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
          />
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="form-group">
        <label htmlFor="contactNumber">Contact Number</label>
        <div className="input-container">
          <i className="icon phone-icon"></i>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <div className="input-container">
          <i className="icon username-icon"></i>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-container">
          <i className="icon password-icon"></i>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="input-container">
          <i className="icon password-icon"></i>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>
    </>
  );

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-content">
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Step {currentStep} of 2</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: currentStep === 1 ? "50%" : "100%" }}
              ></div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            {currentStep === 1 ? renderStep1() : renderStep2()}

            <div className="form-buttons">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="back-button"
                  onClick={prevStep}
                >
                  Back
                </button>
              )}

              {currentStep < 2 ? (
                <button
                  type="button"
                  className="next-button"
                  onClick={nextStep}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={`signup-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
              )}
            </div>
          </form>

          <div className="signin-link">
            <p>
              Already have an account? <Link to="/sign-in">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
