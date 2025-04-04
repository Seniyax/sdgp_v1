/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../style/ForgotPassword.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ForgotPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const query = useQuery();
  const ready = query.get("ready");
  const emailParam = query.get("email");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("api/user/request-password-reset", {
        email,
      });
      if (response.data.success) {
        await Swal.fire({
          title: "Reset Link Sent",
          text: "Check your email for the reset link. If you don't see the email, please check your spam or junk folder.",
          icon: "success",
          confirmButtonText: "Okay",
        }).then(() => {
          navigate("/");
        });
      } else {
        setError(response.data.message || "Failed to request password reset.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post("api/user/reset-password", {
        token: "Ready",
        email: emailParam,
        newPassword,
        confirmPassword,
      });
      if (response.data.success) {
        await Swal.fire({
          title: "Password Reset Successful",
          text: "Your password has been reset. You may now close this window.",
          icon: "success",
          confirmButtonText: "Close Window",
        });
        window.close();
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        {ready ? (
          <>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword} className="fp-form">
              <div className="fp-form__group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="fp-form__group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="fp-error">{error}</div>}
              <button type="submit" className="fp-button" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    Resetting<span className="dot-animation"></span>
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Forgot Password</h2>
            <form onSubmit={handleRequestReset} className="fp-form">
              <div className="fp-form__group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="fp-error">{error}</div>}
              <button type="submit" className="fp-button" disabled={isLoading}>
                {isLoading ? (
                  <span>
                    Sending reset link<span className="dot-animation"></span>
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
