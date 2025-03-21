import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import "../style/Verification.css";

const Verification = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initiating verification process...');
  
  // Simulate verification progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Update status message based on progress
        if (prevProgress === 0) {
          setStatusMessage('Initiating verification process...');
        } else if (prevProgress === 25) {
          setStatusMessage('Checking business information...');
        } else if (prevProgress === 50) {
          setStatusMessage('Validating contact details...');
        } else if (prevProgress === 75) {
          setStatusMessage('Finalizing verification...');
        } else if (prevProgress >= 95) {
          setStatusMessage('Verification complete!');
        }
        
        return prevProgress + 1;
      });
    }, 100);

    // After completion, redirect to dashboard
    const redirectTimer = setTimeout(() => {
      if (progress >= 100) {
        navigate('/business-dashboard');
      }
    }, 12000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, progress]);

  const handleBackClick = () => {
    navigate('/business-dashboard');
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
          <h1>Business Verification</h1>
        </div>
        
        <div className="verification-content">
          <div className="verification-icon">
            {progress < 100 ? (
              <div className="clock-icon">
                <Clock size={64} />
              </div>
            ) : (
              <div className="check-icon">
                <CheckCircle size={64} />
              </div>
            )}
          </div>
          
          <div className="verification-status">
            <h2>{progress < 100 ? 'Verification in Progress' : 'Verification Complete'}</h2>
            <p className="status-message">{statusMessage}</p>
          </div>
          
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="progress-percentage">
            <span>{Math.min(progress, 100)}%</span>
          </div>
          
          <div className="verification-info">
            <h3>What's happening?</h3>
            <p>We're verifying the accuracy of your business information to ensure customers can find and engage with your business effectively.</p>
            <p>This process typically takes just a moment to complete.</p>
          </div>
        </div>
        
        {progress >= 100 && (
          <div className="verification-complete">
            <p>Your business information has been successfully verified!</p>
            <button className="continue-button" onClick={() => navigate('/business-dashboard')}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;