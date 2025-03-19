import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../style/Waiting.css";

const Waiting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { businessName, supervisorUsername, role } = location.state || {};
  
  // If no state was passed, redirect to join page
  useEffect(() => {
    if (!businessName || !supervisorUsername) {
      navigate('/join');
    }
  }, [businessName, supervisorUsername, navigate]);

  const [dotCount, setDotCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState('pending'); // pending, approved, rejected
  
  // Animated dots for waiting indicator
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    
    return () => clearInterval(intervalId);
  }, []);

  // Elapsed time counter
  useEffect(() => {
    const intervalId = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Simulate polling for approval status
  useEffect(() => {
    let intervalId;
    
    const checkApprovalStatus = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('https://api.example.com/check-approval-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            businessName,
            supervisorUsername,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'approved') {
            setStatus('approved');
            // Redirect to dashboard after a delay
            setTimeout(() => {
              navigate('/dashboard');
            }, 3000);
          } else if (data.status === 'rejected') {
            setStatus('rejected');
          }
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };
    
    // For demonstration, we'll simulate approval after 10 seconds
    // In a real app, you would implement polling to check status
    intervalId = setInterval(() => {
      // Simulate random approval or rejection for demo purposes
      if (elapsedTime > 10 && status === 'pending') {
        // 80% chance of approval for demo
        const isApproved = Math.random() < 0.8;
        setStatus(isApproved ? 'approved' : 'rejected');
        
        if (isApproved) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [elapsedTime, status, businessName, supervisorUsername, navigate]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate loading dots
  const dots = '.'.repeat(dotCount);

  // If redirected without proper state, show error
  if (!businessName || !supervisorUsername) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="waiting-container">
      <div className="waiting-card">
        <div className={`status-indicator ${status}`}></div>
        
        <div className="waiting-content">
          <div className="animation-container">
            {status === 'pending' && (
              <div className="orbit-animation">
                <div className="planet"></div>
                <div className="satellite"></div>
              </div>
            )}
            
            {status === 'approved' && (
              <div className="approved-animation">
                <div className="checkmark"></div>
              </div>
            )}
            
            {status === 'rejected' && (
              <div className="rejected-animation">
                <div className="cross"></div>
              </div>
            )}
          </div>
          
          <h1 className={status}>
            {status === 'pending' && `Waiting for Approval${dots}`}
            {status === 'approved' && 'Request Approved!'}
            {status === 'rejected' && 'Request Denied'}
          </h1>
          
          <div className="join-details">
            <div className="detail-item">
              <span className="detail-label">Business:</span>
              <span className="detail-value">{businessName}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Supervisor:</span>
              <span className="detail-value">{supervisorUsername}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{role}</span>
            </div>
            
            {status === 'pending' && (
              <div className="detail-item">
                <span className="detail-label">Elapsed Time:</span>
                <span className="detail-value time">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>
          
          {status === 'pending' && (
            <p className="waiting-message">
              Your request has been sent to {supervisorUsername} for approval.
              You'll be automatically redirected once approved.
            </p>
          )}
          
          {status === 'approved' && (
            <p className="waiting-message success">
              Congratulations! Your request has been approved.
              Redirecting to dashboard...
            </p>
          )}
          
          {status === 'rejected' && (
            <div>
              <p className="waiting-message error">
                Your request was denied by the supervisor.
                Please contact them directly for more information.
              </p>
              <button 
                className="try-again-button"
                onClick={() => navigate('/join')}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Waiting;