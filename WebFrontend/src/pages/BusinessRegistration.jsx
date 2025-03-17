
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info, ArrowRight, Building, MapPin, Phone, Mail, Globe, Calendar, Clock, Camera, Upload } from 'lucide-react';
import "../style/BusinessRegistration.css"; 

const BusinessRegistration = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        description: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        openingHours: {
            monday: { open: '09:00', close: '17:00', closed: false },
            tuesday: { open: '09:00', close: '17:00', closed: false },
            wednesday: { open: '09:00', close: '17:00', closed: false },
            thursday: { open: '09:00', close: '17:00', closed: false },
            friday: { open: '09:00', close: '17:00', closed: false },
            saturday: { open: '10:00', close: '15:00', closed: false },
            sunday: { open: '10:00', close: '15:00', closed: true },
        },
        logo: null,
        coverImage: null,
        images: [],
        reservationSlots: {
            defaultDuration: 30,
            capacity: 1,
            advance: 7,
        },
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
        },
        contactPerson: {
            name: '',
            position: '',
            phone: '',
            email: '',
        },
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState({
        logo: null,
        coverImage: null,
        images: [],
    });

    const categories = [
        'Restaurant', 'Cafe', 'Salon', 'Spa', 'Medical', 'Fitness',
        'Hotel', 'Event Space', 'Coworking', 'Retail', 'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNestedChange = (category, field, value) => {
        setFormData({
            ...formData,
            [category]: {
                ...formData[category],
                [field]: value
            }
        });
    };

    const handleHoursChange = (day, field, value) => {
        setFormData({
            ...formData,
            openingHours: {
                ...formData.openingHours,
                [day]: {
                    ...formData.openingHours[day],
                    [field]: field === 'closed' ? !formData.openingHours[day].closed : value
                }
            }
        });
    };

    const handleFileChange = (e, type) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (type === 'logo' || type === 'coverImage') {
                setFormData({
                    ...formData,
                    [type]: file
                });

                const reader = new FileReader();
                reader.onload = (event) => {
                    setPreview({
                        ...preview,
                        [type]: event.target.result
                    });
                };
                reader.readAsDataURL(file);
            } else if (type === 'images') {
                const newImages = [...formData.images];
                newImages.push(file);
                setFormData({
                    ...formData,
                    images: newImages
                });

                const reader = new FileReader();
                reader.onload = (event) => {
                    setPreview({
                        ...preview,
                        images: [...preview.images, event.target.result]
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const removeImage = (index) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData({
            ...formData,
            images: newImages
        });

        const newPreviews = [...preview.images];
        newPreviews.splice(index, 1);
        setPreview({
            ...preview,
            images: newPreviews
        });
    };

    const validateStep = (step) => {
        let isValid = true;
        let newErrors = {};

        if (step === 1) {
            if (!formData.businessName.trim()) {
                newErrors.businessName = 'Business name is required';
                isValid = false;
            }

            if (!formData.category) {
                newErrors.category = 'Please select a category';
                isValid = false;
            }

            if (!formData.description.trim()) {
                newErrors.description = 'Description is required';
                isValid = false;
            }
        } else if (step === 2) {
            if (!formData.address.trim()) {
                newErrors.address = 'Address is required';
                isValid = false;
            }

            if (!formData.city.trim()) {
                newErrors.city = 'City is required';
                isValid = false;
            }

            if (!formData.state.trim()) {
                newErrors.state = 'State is required';
                isValid = false;
            }

            if (!formData.zipCode.trim()) {
                newErrors.zipCode = 'ZIP code is required';
                isValid = false;
            }

            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
                isValid = false;
            }

            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Email is invalid';
                isValid = false;
            }
        } else if (step === 3) {
            // Validation for step 3 could be added here
            // For now, we'll assume all image/logo uploads are optional
        }

        setErrors(newErrors);
        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Here you would typically send the data to your backend
            console.log('Submitting form data:', formData);
            // Show success message or redirect
            alert('Registration successful! Welcome to Slotzi!');
            navigate('/business-dashboard');
        }
    };

    const renderStepIndicator = () => {
        return (
            <div className="step-indicator">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-number">
                        {currentStep > 1 ? <Check size={18} /> : 1}
                    </div>
                    <div className="step-label">Business Info</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-number">
                        {currentStep > 2 ? <Check size={18} /> : 2}
                    </div>
                    <div className="step-label">Location & Contact</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">
                        {currentStep > 3 ? <Check size={18} /> : 3}
                    </div>
                    <div className="step-label">Media & Hours</div>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
                    <div className="step-number">4</div>
                    <div className="step-label">Scheduling</div>
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content">
                        <h2>Tell us about your business</h2>
                        <p>Let's start with some basic information about your business.</p>

                        <div className="form-group">
                            <label htmlFor="businessName">Business Name <span className="required">*</span></label>
                            <div className="input-container">
                                <Building size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    placeholder="Enter your business name"
                                    className={errors.businessName ? 'error' : ''}
                                />
                            </div>
                            {errors.businessName && <div className="error-message">{errors.businessName}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category <span className="required">*</span></label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? 'error' : ''}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <div className="error-message">{errors.category}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description <span className="required">*</span></label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell customers about your business"
                                rows="4"
                                className={errors.description ? 'error' : ''}
                            ></textarea>
                            {errors.description && <div className="error-message">{errors.description}</div>}
                            <div className="helper-text">Brief description of your business that will appear on your profile (max 500 characters)</div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-primary" onClick={nextStep}>
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="step-content">
                        <h2>Location & Contact Details</h2>
                        <p>Where can customers find and contact you?</p>

                        <div className="form-group">
                            <label htmlFor="address">Street Address <span className="required">*</span></label>
                            <div className="input-container">
                                <MapPin size={18} className="input-icon" />
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your street address"
                                    className={errors.address ? 'error' : ''}
                                />
                            </div>
                            {errors.address && <div className="error-message">{errors.address}</div>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className={errors.city ? 'error' : ''}
                                />
                                {errors.city && <div className="error-message">{errors.city}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="state">State <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className={errors.state ? 'error' : ''}
                                />
                                {errors.state && <div className="error-message">{errors.state}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="zipCode">ZIP Code <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="ZIP Code"
                                    className={errors.zipCode ? 'error' : ''}
                                />
                                {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Country"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                            <div className="input-container">
                                <Phone size={18} className="input-icon" />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className={errors.phone ? 'error' : ''}
                                />
                            </div>
                            {errors.phone && <div className="error-message">{errors.phone}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Business Email <span className="required">*</span></label>
                            <div className="input-container">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your business email"
                                    className={errors.email ? 'error' : ''}
                                />
                            </div>
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="website">Website</label>
                            <div className="input-container">
                                <Globe size={18} className="input-icon" />
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://www.example.com"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={prevStep}>
                                Back
                            </button>
                            <button type="button" className="btn btn-primary" onClick={nextStep}>
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="step-content">
                        <h2>Business Media & Hours</h2>
                        <p>Upload images and set your business hours.</p>

                        <div className="upload-section">
                            <h3>Business Logo</h3>
                            <div className="upload-container">
                                <div className="upload-area" onClick={() => document.getElementById('logoUpload').click()}>
                                    {preview.logo ? (
                                        <img src={preview.logo} alt="Logo Preview" className="preview-image" />
                                    ) : (
                                        <>
                                            <Camera size={32} />
                                            <span>Upload Logo</span>
                                            <span className="upload-desc">Click to upload (PNG, JPG, SVG)</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="logoUpload"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'logo')}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="upload-section">
                            <h3>Cover Image</h3>
                            <div className="upload-container">
                                <div className="upload-area cover-area" onClick={() => document.getElementById('coverUpload').click()}>
                                    {preview.coverImage ? (
                                        <img src={preview.coverImage} alt="Cover Preview" className="preview-image" />
                                    ) : (
                                        <>
                                            <Upload size={32} />
                                            <span>Upload Cover Image</span>
                                            <span className="upload-desc">Recommended: 1200x300 pixels</span>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="coverUpload"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'coverImage')}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="upload-section">
                            <h3>Business Photos</h3>
                            <div className="gallery-container">
                                {preview.images.map((img, index) => (
                                    <div key={index} className="gallery-item">
                                        <img src={img} alt={`Business Image ${index + 1}`} />
                                        <button type="button" className="remove-image" onClick={() => removeImage(index)}>×</button>
                                    </div>
                                ))}
                                <div className="upload-area gallery-upload" onClick={() => document.getElementById('galleryUpload').click()}>
                                    <Camera size={24} />
                                    <span>Add Photo</span>
                                </div>
                                <input
                                    type="file"
                                    id="galleryUpload"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'images')}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="hours-section">
                            <h3>Business Hours</h3>
                            <div className="hours-container">
                                {Object.entries(formData.openingHours).map(([day, hours]) => (
                                    <div key={day} className="hours-row">
                                        <div className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                                        <div className="hours-inputs">
                                            <input
                                                type="time"
                                                value={hours.open}
                                                onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                                disabled={hours.closed}
                                            />
                                            <span>to</span>
                                            <input
                                                type="time"
                                                value={hours.close}
                                                onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                                disabled={hours.closed}
                                            />
                                        </div>
                                        <div className="closed-checkbox">
                                            <input
                                                type="checkbox"
                                                id={`closed-${day}`}
                                                checked={hours.closed}
                                                onChange={() => handleHoursChange(day, 'closed')}
                                            />
                                            <label htmlFor={`closed-${day}`}>Closed</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={prevStep}>
                                Back
                            </button>
                            <button type="button" className="btn btn-primary" onClick={nextStep}>
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="step-content">
                        <h2>Reservation Settings</h2>
                        <p>Configure how customers can book appointments with you.</p>

                        <div className="form-group">
                            <label htmlFor="defaultDuration">Default Appointment Duration (minutes)</label>
                            <input
                                type="number"
                                id="defaultDuration"
                                min="5"
                                step="5"
                                value={formData.reservationSlots.defaultDuration}
                                onChange={(e) => handleNestedChange('reservationSlots', 'defaultDuration', parseInt(e.target.value))}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="capacity">Maximum Bookings per Time Slot</label>
                            <input
                                type="number"
                                id="capacity"
                                min="1"
                                value={formData.reservationSlots.capacity}
                                onChange={(e) => handleNestedChange('reservationSlots', 'capacity', parseInt(e.target.value))}
                            />
                            <div className="helper-text">How many customers can book the same time slot?</div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="advance">Advance Booking Period (days)</label>
                            <input
                                type="number"
                                id="advance"
                                min="1"
                                value={formData.reservationSlots.advance}
                                onChange={(e) => handleNestedChange('reservationSlots', 'advance', parseInt(e.target.value))}
                            />
                            <div className="helper-text">How far in advance can customers book?</div>
                        </div>

                        <div className="social-section">
                            <h3>Social Media (Optional)</h3>
                            <div className="form-group">
                                <label htmlFor="facebook">Facebook</label>
                                <input
                                    type="text"
                                    id="facebook"
                                    placeholder="https://facebook.com/yourbusiness"
                                    value={formData.socialMedia.facebook}
                                    onChange={(e) => handleNestedChange('socialMedia', 'facebook', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="instagram">Instagram</label>
                                <input
                                    type="text"
                                    id="instagram"
                                    placeholder="https://instagram.com/yourbusiness"
                                    value={formData.socialMedia.instagram}
                                    onChange={(e) => handleNestedChange('socialMedia', 'instagram', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="twitter">Twitter</label>
                                <input
                                    type="text"
                                    id="twitter"
                                    placeholder="https://twitter.com/yourbusiness"
                                    value={formData.socialMedia.twitter}
                                    onChange={(e) => handleNestedChange('socialMedia', 'twitter', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="contact-section">
                            <h3>Primary Contact Person</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contactName">Name</label>
                                    <input
                                        type="text"
                                        id="contactName"
                                        placeholder="Full Name"
                                        value={formData.contactPerson.name}
                                        onChange={(e) => handleNestedChange('contactPerson', 'name', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contactPosition">Position</label>
                                    <input
                                        type="text"
                                        id="contactPosition"
                                        placeholder="Job Title"
                                        value={formData.contactPerson.position}
                                        onChange={(e) => handleNestedChange('contactPerson', 'position', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contactPhone">Phone</label>
                                    <input
                                        type="tel"
                                        id="contactPhone"
                                        placeholder="Contact Phone"
                                        value={formData.contactPerson.phone}
                                        onChange={(e) => handleNestedChange('contactPerson', 'phone', e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contactEmail">Email</label>
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        placeholder="Contact Email"
                                        value={formData.contactPerson.email}
                                        onChange={(e) => handleNestedChange('contactPerson', 'email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={prevStep}>
                                Back
                            </button>
                            <button type="submit" className="btn btn-success" onClick={handleSubmit}>
                                Complete Registration
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="business-register-container">
            <div className="registration-header">
                <h1>Register Your Business on Slotzi</h1>
                <p>Let customers easily book appointments and reservations with you.</p>
            </div>

            {renderStepIndicator()}

            <form className="registration-form">
                {renderStepContent()}
            </form>

            <div className="registration-footer">
                <p>Need help? Contact our support team at support@slotzi.com</p>
            </div>
        </div>
    );
};

export default BusinessRegistration;
