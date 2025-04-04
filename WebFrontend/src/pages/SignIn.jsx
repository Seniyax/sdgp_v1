/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/SignIn.css";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.is_verified) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload = {
      username: formData.username,
      password: formData.password,
    };

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));
    let response;

    try {
      response = await axios.post("api/user/sign-in", payload);
    } catch (err) {
      await delayPromise;
      const message =
        err.response?.data?.message ||
        "An error occurred during sign in. Please try again.";
      setError(message);
      setIsLoading(false);
      return;
    }
    await delayPromise;

    if (response.data.success) {
      console.log("Login successful", response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    }
    setIsLoading(false);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-content">
          <div className="signin-header">
            <h2>Sign In</h2>
            <p>Sign in to continue to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="signin-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  Signing In<span className="dot-animation"></span>
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="signup-link">
            <p>
              Don&apos;t have an account? <Link to="/sign-up">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
