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
    // Show success toast
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
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
    <div className="dashboard-container">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="success-toast">
          <CheckCircle size={20} />
          <span>Business successfully deleted</span>
          <button onClick={() => setShowSuccessToast(false)}><X size={16} /></button>
        </div>
      )}

      {/* Header Section with Cover Image */}
      <div className="dashboard-header" style={{ backgroundImage: `url(${businessData.coverImage})` }}>
        <div className="header-overlay">
          <div className="business-logo">
            <img src={businessData.logo} alt={`${businessData.businessName} logo`} />
          </div>
          <div className="business-title">
            <h1>{businessData.businessName}</h1>
            <span className="business-category">{businessData.category}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        <button className="action-button edit-button" onClick={handleEditClick}>
          <Edit size={18} />
          Edit Business
          {showEditOptions && (
            <div className="edit-dropdown">
              <button onClick={handleEditBusiness}>Edit All Information</button>
              <button>Edit Business Hours</button>
              <button>Edit Images</button>
              <button>Edit Contact Info</button>
            </div>
          )}
        </button>
        <button className="action-button confirm-button" onClick={handleConfirmClick}>
          <CheckSquare size={18} />
          Confirm Details
        </button>
        <button className="action-button delete-button" onClick={handleDeleteClick}>
          <Trash2 size={18} />
          Delete Business
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Business Details Section */}
        <div className="dashboard-section">
          <div className="section-header" onClick={() => toggleSection('details')}>
            <h2><Building size={20} /> Business Details</h2>
            {expandedSections.details ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.details && (
            <div className="section-content">
              <div className="content-row">
                <div className="content-label">Business Name</div>
                <div className="content-value">{businessData.businessName}</div>
              </div>
              <div className="content-row">
                <div className="content-label">Category</div>
                <div className="content-value">{businessData.category}</div>
              </div>
              <div className="content-row">
                <div className="content-label">Description</div>
                <div className="content-value description">{businessData.description}</div>
              </div>
            </div>
          )}
        </div>

        {/* Location & Contact Section */}
        <div className="dashboard-section">
          <div className="section-header" onClick={() => toggleSection('contact')}>
            <h2><MapPin size={20} /> Location & Contact</h2>
            {expandedSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.contact && (
            <div className="section-content">
              <div className="content-row">
                <div className="content-label">Address</div>
                <div className="content-value">
                  {businessData.address}, {businessData.city}, {businessData.state} {businessData.zipCode} 
                  {businessData.country && `, ${businessData.country}`}
                </div>
              </div>
              <div className="content-row">
                <div className="content-label">Phone</div>
                <div className="content-value">
                  <Phone size={16} className="icon-small" /> {businessData.phone}
                </div>
              </div>
              <div className="content-row">
                <div className="content-label">Email</div>
                <div className="content-value">
                  <Mail size={16} className="icon-small" /> {businessData.email}
                </div>
              </div>
              {businessData.website && (
                <div className="content-row">
                  <div className="content-label">Website</div>
                  <div className="content-value">
                    <Globe size={16} className="icon-small" /> 
                    <a href={businessData.website} target="_blank" rel="noopener noreferrer">
                      {businessData.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Business Hours Section */}
        <div className="dashboard-section">
          <div className="section-header" onClick={() => toggleSection('hours')}>
            <h2><Clock size={20} /> Business Hours</h2>
            {expandedSections.hours ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.hours && (
            <div className="section-content hours-grid">
              {Object.entries(businessData.openingHours).map(([day, hours]) => (
                <div key={day} className="hours-row">
                  <div className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                  <div className="hours-value">
                    {hours.closed ? (
                      <span className="closed-text">Closed</span>
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
          <div className="section-header" onClick={() => toggleSection('media')}>
            <h2><Camera size={20} /> Business Images</h2>
            {expandedSections.media ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.media && (
            <div className="section-content">
              <div className="image-gallery">
                {businessData.images.map((image, index) => (
                  <div key={index} className="gallery-image">
                    <img src={image} alt={`Business ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reservation Settings Section */}
        <div className="dashboard-section">
          <div className="section-header" onClick={() => toggleSection('reservations')}>
            <h2><Calendar size={20} /> Reservation Settings</h2>
            {expandedSections.reservations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.reservations && (
            <div className="section-content">
              <div className="content-row">
                <div className="content-label">Default Duration</div>
                <div className="content-value">{businessData.reservationSlots.defaultDuration} minutes</div>
              </div>
              <div className="content-row">
                <div className="content-label">Maximum Bookings per Slot</div>
                <div className="content-value">{businessData.reservationSlots.capacity} customers</div>
              </div>
              <div className="content-row">
                <div className="content-label">Advance Booking Period</div>
                <div className="content-value">{businessData.reservationSlots.advance} days</div>
              </div>
            </div>
          )}
        </div>

        {/* Social Media Section */}
        <div className="dashboard-section">
          <div className="section-header" onClick={() => toggleSection('social')}>
            <h2><Globe size={20} /> Social Media</h2>
            {expandedSections.social ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.social && (
            <div className="section-content">
              <div className="social-links">
                {businessData.socialMedia.facebook && (
                  <a href={businessData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                    <Facebook size={20} />
                    <span>Facebook</span>
                  </a>
                )}
                {businessData.socialMedia.instagram && (
                  <a href={businessData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                    <Instagram size={20} />
                    <span>Instagram</span>
                  </a>
                )}
                {businessData.socialMedia.twitter && (
                  <a href={businessData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                    <Twitter size={20} />
                    <span>Twitter</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Person Section */}
        <div className="dashboard-section">
          <div className="section-header" onClick={() => toggleSection('contact')}>
            <h2><User size={20} /> Primary Contact</h2>
            {expandedSections.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.contact && (
            <div className="section-content">
              <div className="contact-person-card">
                <div className="contact-person-avatar">
                  <User size={40} />
                </div>
                <div className="contact-person-details">
                  <h3>{businessData.contactPerson.name}</h3>
                  <p className="contact-position">
                    <Briefcase size={14} className="icon-tiny" /> {businessData.contactPerson.position}
                  </p>
                  <p>
                    <Phone size={14} className="icon-tiny" /> {businessData.contactPerson.phone}
                  </p>
                  <p>
                    <Mail size={14} className="icon-tiny" /> {businessData.contactPerson.email}
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
          <div className="delete-modal">
            <div className="modal-header">
              <AlertTriangle size={24} className="warning-icon" />
              <h2>Delete Business?</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{businessData.businessName}</strong>? This action cannot be undone.</p>
              <p>All business information, including reservation settings and customer data, will be permanently removed.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancelDelete}>Cancel</button>
              <button className="btn-delete" onClick={handleConfirmDelete}>Delete Business</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Details Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="modal-header">
              <CheckCircle size={24} className="success-icon" />
              <h2>Confirm Business Details</h2>
            </div>
            <div className="modal-body">
              <p>Please review and confirm that all details for <strong>{businessData.businessName}</strong> are accurate and up-to-date.</p>
              <p>Confirming these details will mark your business information as verified in our system.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancelConfirm}>Cancel</button>
              <button className="btn-confirm" onClick={handleConfirmDetails}>Confirm Details</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;