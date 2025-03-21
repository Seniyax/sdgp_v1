import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../style/SignIn.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Check for demo validation
      if (formData.username && formData.password) {
        console.log('Login successful', formData);
        // Add your actual login logic here
      } else {
        setError('Please fill in all required fields');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-content">
          <div className="signin-header">
            <h2>Welcome Back!</h2>
            <p>Sign in to continue to your account</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="signin-form">
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
                  placeholder="Enter your username"
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
              className={`signin-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="signup-link">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          </div>
          
          <div className="social-signin">
            <p>Or sign in with</p>
            <div className="social-buttons">
              <button className="social-button google">Google</button>
              <button className="social-button facebook">Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;