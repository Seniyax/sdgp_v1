import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Verification.css";

const Verification = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Verifying details");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          // Navigate to dashboard or home after verification is complete
          setTimeout(() => navigate("/dashboard"), 500);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 30); // Total loading time: ~3 seconds

    // Animate the loading dots
    const dotsInterval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return "";
        return prevDots + ".";
      });
    }, 400);

    // Update loading text based on progress
    const textInterval = setInterval(() => {
      if (progress < 33) {
        setLoadingText("Verifying details");
      } else if (progress < 66) {
        setLoadingText("Authenticating");
      } else if (progress < 100) {
        setLoadingText("Preparing your dashboard");
      }
    }, 1000);

    // Clean up intervals
    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
      clearInterval(textInterval);
    };
  }, [navigate, progress]);

  return (
    <div className="global-container">
      <div className="verification-container">
        <div className="verification-card">
          <div className="logo-container">
            <div className="logo">SlotZi</div>
          </div>

          <div className="loading-animation">
            <div className="spinner"></div>
          </div>

          <div className="verification-text">
            {loadingText}
            <span className="loading-dots">{dots}</span>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="verification-message">
            Please wait while we verify your account information
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
