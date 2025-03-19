import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Camera,
  Facebook,
  Instagram,
  Twitter,
  AlertTriangle,
  X,
  CheckCircle,
  User,
  Briefcase,
  CheckSquare
} from 'lucide-react';
import "../style/BusinessDashboard.css";

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    hours: true,
    media: true,
    reservations: true,
    social: true,
    contact: true
  });

  // Mock data - this would come from your API or state management
  const [businessData, setBusinessData] = useState({
    businessName: 'Coastal Breeze Spa & Salon',
    category: 'Spa',
    description: 'Luxury spa and salon services in a relaxing coastal atmosphere. We offer a variety of treatments including massages, facials, haircuts, styling, and nail services.',
    address: '783 Ocean View Boulevard',
    city: 'Santa Monica',
    state: 'CA',
    zipCode: '90401',
    country: 'United States',
    phone: '(310) 555-8732',
    email: 'info@coastalbreezespa.com',
    website: 'https://www.coastalbreezespa.com',
    openingHours: {
      monday: { open: '09:00', close: '19:00', closed: false },
      tuesday: { open: '09:00', close: '19:00', closed: false },
      wednesday: { open: '09:00', close: '19:00', closed: false },
      thursday: { open: '09:00', close: '20:00', closed: false },
      friday: { open: '09:00', close: '20:00', closed: false },
      saturday: { open: '10:00', close: '18:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: false },
    },
    logo: '/sample-images/spa-logo.png',
    coverImage: '/sample-images/spa-cover.jpg',
    images: ['/sample-images/spa-1.jpg', '/sample-images/spa-2.jpg', '/sample-images/spa-3.jpg'],
    reservationSlots: {
      defaultDuration: 60,
      capacity: 3,
      advance: 14,
    },
    socialMedia: {
      facebook: 'https://facebook.com/coastalbreezespa',
      instagram: 'https://instagram.com/coastalbreezespa',
      twitter: 'https://twitter.com/coastalbreezespa',
    },
    contactPerson: {
      name: 'Jessica Wilson',
      position: 'Spa Manager',
      phone: '(310) 555-9241',
      email: 'jessica@coastalbreezespa.com',
    },
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleEditClick = () => {
    setShowEditOptions(!showEditOptions);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = () => {
    // Here you would call your API to delete the business
    setShowDeleteModal(false);
    // Show success toast then redirect after a delay
    setShowSuccessToast(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const handleConfirmDetails = () => {
    // Here you would call your API to confirm business details
    setShowConfirmModal(false);
    
    // Navigate to verification.jsx page
    navigate('/verification');
  };

  const handleEditBusiness = () => {
    navigate('/edit-business');
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="business-dashboard">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="success-toast">
          <CheckCircle className="success-icon" />
          <p>Business successfully deleted</p>
          <button className="close-toast" onClick={() => setShowSuccessToast(false)}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Header Section with Cover Image */}
      <div className="dashboard-header" style={{ backgroundImage: `url(${businessData.coverImage})` }}>
        <div className="header-overlay">
          <div className="business-logo">
            <img src={businessData.logo} alt={`${businessData.businessName} logo`} />
          </div>
          <div className="business-header-info">
            <h1 className="business-name">{businessData.businessName}</h1>
            <span className="business-category">
              <Building size={16} className="icon" />
              {businessData.category}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        <div className="edit-dropdown">
          <button className="btn btn-primary" onClick={handleEditClick}>
            <Edit size={16} className="icon" /> Edit Business
          </button>
          {showEditOptions && (
            <div className="edit-dropdown-content">
              <button onClick={handleEditBusiness}>Edit All Information</button>
              <button onClick={handleEditBusiness}>Edit Business Hours</button>
              <button onClick={handleEditBusiness}>Edit Images</button>
              <button onClick={handleEditBusiness}>Edit Contact Info</button>
            </div>
          )}
        </div>
        <button className="btn btn-secondary" onClick={handleConfirmClick}>
          <CheckSquare size={16} className="icon" /> Confirm Details
        </button>
        <button className="btn btn-danger" onClick={handleDeleteClick}>
          <Trash2 size={16} className="icon" /> Delete Business
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Business Details Section */}
        <div className="dashboard-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('details')}
          >
            <h2>
              <Building size={20} className="icon" /> Business Details
            </h2>
            <button className="toggle-btn">
              {expandedSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.details && (
            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    Business Name
                  </div>
                  <div className="info-value">
                    {businessData.businessName}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    Category
                  </div>
                  <div className="info-value">
                    {businessData.category}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    Description
                  </div>
                  <div className="info-value">
                    {businessData.description}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location & Contact Section */}
        <div className="dashboard-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('contact')}
          >
            <h2>
              <MapPin size={20} className="icon" /> Location & Contact
            </h2>
            <button className="toggle-btn">
              {expandedSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.contact && (
            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <MapPin size={16} className="icon" /> Address
                  </div>
                  <div className="info-value">
                    {businessData.address}, {businessData.city}, {businessData.state} {businessData.zipCode}
                    {businessData.country && `, ${businessData.country}`}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Phone size={16} className="icon" /> Phone
                  </div>
                  <div className="info-value">
                    {businessData.phone}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Mail size={16} className="icon" /> Email
                  </div>
                  <div className="info-value">
                    {businessData.email}
                  </div>
                </div>

                {businessData.website && (
                  <div className="info-item">
                    <div className="info-label">
                      <Globe size={16} className="icon" /> Website
                    </div>
                    <div className="info-value">
                      <a href={businessData.website} target="_blank" rel="noopener noreferrer">
                        {businessData.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Business Hours Section */}
        <div className="dashboard-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('hours')}
          >
            <h2>
              <Clock size={20} className="icon" /> Business Hours
            </h2>
            <button className="toggle-btn">
              {expandedSections.hours ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.hours && (
            <div className="section-content hours-grid">
              {Object.entries(businessData.openingHours).map(([day, hours]) => (
                <div className="hours-item" key={day}>
                  <div className="day-name">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </div>
                  <div className="hours-value">
                    {hours.closed ? (
                      <span className="closed">Closed</span>
                    ) : (
                      <span>{formatTime(hours.open)} - {formatTime(hours.close)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business Images Section */}
        <div className="dashboard-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('media')}
          >
            <h2>
              <Camera size={20} className="icon" /> Business Images
            </h2>
            <button className="toggle-btn">
              {expandedSections.media ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.media && (
            <div className="section-content">
              <div className="image-gallery">
                {businessData.images.map((image, index) => (
                  <div className="gallery-image" key={index}>
                    <img src={image} alt={`Business image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reservation Settings Section */}
        <div className="dashboard-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('reservations')}
          >
            <h2>
              <Calendar size={20} className="icon" /> Reservation Settings
            </h2>
            <button className="toggle-btn">
              {expandedSections.reservations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.reservations && (
            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    Default Duration
                  </div>
                  <div className="info-value">
                    {businessData.reservationSlots.defaultDuration} minutes
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    Maximum Bookings per Slot
                  </div>
                  <div className="info-value">
                    {businessData.reservationSlots.capacity} customers
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    Advance Booking Period
                  </div>
                  <div className="info-value">
                    {businessData.reservationSlots.advance} days
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Media Section */}
        <div className="dashboard-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('social')}
          >
            <h2>
              <Globe size={20} className="icon" /> Social Media
            </h2>
            <button className="toggle-btn">
              {expandedSections.social ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.social && (
            <div className="section-content">
              <div className="social-links">
                {businessData.socialMedia.facebook && (
                  <a href={businessData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Facebook size={20} className="icon" />
                    Facebook
                  </a>
                )}
                {businessData.socialMedia.instagram && (
                  <a href={businessData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Instagram size={20} className="icon" />
                    Instagram
                  </a>
                )}
                {businessData.socialMedia.twitter && (
                  <a href={businessData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Twitter size={20} className="icon" />
                    Twitter
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Person Section */}
        <div className="dashboard-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('contact')}
          >
            <h2>
              <User size={20} className="icon" /> Primary Contact
            </h2>
            <button className="toggle-btn">
              {expandedSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedSections.contact && (
            <div className="section-content">
              <div className="contact-person">
                <div className="contact-avatar">
                  <User size={48} />
                </div>
                <div className="contact-details">
                  <h3 className="contact-name">
                    {businessData.contactPerson.name}
                  </h3>
                  <p className="contact-position">
                    <Briefcase size={14} className="icon" /> {businessData.contactPerson.position}
                  </p>
                  <p className="contact-phone">
                    <Phone size={14} className="icon" /> {businessData.contactPerson.phone}
                  </p>
                  <p className="contact-email">
                    <Mail size={14} className="icon" /> {businessData.contactPerson.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Business Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>
                <AlertTriangle size={24} className="icon warning" /> Delete Business?
              </h2>
              <button className="modal-close" onClick={handleCancelDelete}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <p className="warning-message">
                Are you sure you want to delete {businessData.businessName}? This action cannot be undone.
              </p>
              <p className="info-message">
                All business information, including reservation settings and customer data, will be permanently removed.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Delete Business
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Details Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>
                <CheckCircle size={24} className="icon success" /> Confirm Business Details
              </h2>
              <button className="modal-close" onClick={handleCancelConfirm}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <p className="confirm-message">
                Please review and confirm that all details for {businessData.businessName} are accurate and up-to-date.
              </p>
              <p className="info-message">
                Confirming these details will mark your business information as verified in our system.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCancelConfirm}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleConfirmDetails}>
                Confirm Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;