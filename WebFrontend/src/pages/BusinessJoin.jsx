import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/BusinessJoin.css";

const BusinessJoin = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [supervisorUsername, setSupervisorUsername] = useState('');
  const [role, setRole] = useState('Staff');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch businesses from API
    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('https://api.example.com/businesses');
        if (!response.ok) {
          throw new Error('Failed to fetch businesses');
        }
        const data = await response.json();
        setBusinesses(data);
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
    if (!isFormValid) return;

    try {
      // Submit join request to API
      const response = await fetch('https://api.example.com/join-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: selectedBusiness,
          supervisorUsername,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit join request');
      }

      // Navigate to waiting page
      navigate('/waiting', { 
        state: { 
          businessName: businesses.find(b => b.id === selectedBusiness)?.name,
          supervisorUsername,
          role 
        } 
      });
    } catch (err) {
      setError(err.message);
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
                <option value="" disabled>Select a business</option>
                {businesses.map((business) => (
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
                className={role === 'Admin' ? 'active' : ''}
                onClick={() => setRole('Admin')}
              >
                Admin
              </button>
              <button
                type="button"
                className={role === 'Staff' ? 'active' : ''}
                onClick={() => setRole('Staff')}
              >
                Staff
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`join-button ${isFormValid ? 'active' : 'disabled'}`}
            disabled={!isFormValid}
          >
            Join Business
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessJoin;