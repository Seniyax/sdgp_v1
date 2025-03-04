import React, { useState } from 'react';
import "../style/Businessform.css";

const BusinessRegistrationForm = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        category: '',
        logo: null,
        location: '',
        operationHours: '',
        contactDetails: '',
        description: '',
        priceRange: 50
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            logo: e.target.files[0]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <div className="registration-container">
            <div className="registration-left">
                <div className="logo-container">
                    <div className="logo">
                        <span>Z</span>
                    </div>
                </div>
                <div className="registration-title">
                    <h1>Register Your Business!</h1>
                    <h2>Get Booked! Grow Faster</h2>
                </div>
            </div>

            <div className="registration-right">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="businessName">Business Name <span className="required">*</span></label>
                            <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                placeholder="Value"
                                value={formData.businessName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email <span className="required">*</span></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Value"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category <span className="required">*</span></label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Value</option>
                                <option value="retail">Retail</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="service">Service</option>
                                <option value="technology">Technology</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="logo">Business Logo <span className="required">*</span></label>
                            <div className="file-input">
                                <input
                                    type="file"
                                    id="logo"
                                    name="logo"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    required
                                />
                                <label htmlFor="logo" className="file-label">Add file</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="location">Location <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="Value"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="input-icon">+</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="operationHours">Operation Hours <span className="required">*</span></label>
                            <select
                                id="operationHours"
                                name="operationHours"
                                value={formData.operationHours}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Value</option>
                                <option value="24/7">24/7</option>
                                <option value="weekdays">Weekdays 9AM-5PM</option>
                                <option value="weekends">Weekends Only</option>
                                <option value="custom">Custom Hours</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="contactDetails">Contact Details <span className="required">*</span></label>
                            <div className="input-with-icon">
                                <input
                                    type="text"
                                    id="contactDetails"
                                    name="contactDetails"
                                    placeholder="Value"
                                    value={formData.contactDetails}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="input-icon">+</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priceRange">Choose Range <span className="required">*</span></label>
                            <div className="range-container">
                                <input
                                    type="range"
                                    id="priceRange"
                                    name="priceRange"
                                    min="0"
                                    max="100"
                                    value={formData.priceRange}
                                    onChange={handleChange}
                                    required
                                />
                                <span className="range-value">${formData.priceRange}-100</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full-width">
                            <label htmlFor="description">Description <span className="required">*</span></label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Value"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <button type="submit" className="submit-button">Register Now</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessRegistrationForm;