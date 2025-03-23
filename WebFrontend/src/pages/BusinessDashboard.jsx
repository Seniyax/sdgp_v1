/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Trash2,
  Facebook,
  Instagram,
  Twitter,
  User,
  Briefcase,
} from "lucide-react";
import Swal from "sweetalert2";
import "../style/BusinessDashboard.css";

const BusinessDashboard = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.post("/api/business/get-by-id", {
        business_id: businessId,
      });
      if (response.data.success && response.data.data) {
        const fetchedBusiness = response.data.data.business;
        sessionStorage.setItem("business", JSON.stringify(fetchedBusiness));
        setBusiness(fetchedBusiness);
      } else {
        setError(response.data.message || "Failed to fetch business data.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId, fetchBusiness]);

  // Check if user is logged in and business is loaded; otherwise, redirect to home.
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || (!loading && !business)) {
      navigate("/");
    }
  }, [navigate, business, loading]);

  if (loading) {
    return <div>Loading business data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Destructure values from the fetched business.
  const {
    name,
    description,
    logo,
    cover,
    opening_hour,
    closing_hour,
    facebook_link,
    instagram_link,
    twitter_link,
  } = business;

  // Default images if logo/cover are missing.
  const defaultLogo = "/default-logo.png";
  const defaultCover = "/default-cover.jpg";

  // Delete business handler
  const handleDelete = () => {
    Swal.fire({
      title: "Delete Business?",
      text: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Business",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/business/delete", {
            data: { business_id: businessId },
          });
          Swal.fire("Deleted!", "Business has been deleted.", "success");
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || "Failed to delete business.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="business-dashboard">
      {/* Header Section with Cover Image */}
      <div
        className="dashboard-header"
        style={{ backgroundImage: `url(${cover || defaultCover})` }}
      >
        <div className="header-overlay">
          <div className="business-logo">
            <img src={logo || defaultLogo} alt={`${name} logo`} />
          </div>
          <div className="business-header-info">
            <h1 className="business-name">{name}</h1>
          </div>
        </div>
      </div>

      {/* Only Delete Button */}
      <div className="dashboard-actions">
        <button className="btn btn-danger" onClick={handleDelete}>
          <Trash2 size={16} className="icon" /> Delete Business
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Business Details Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Building size={20} className="icon" /> Business Details
            </h2>
          </div>
          <div className="section-content">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Business Name</div>
                <div className="info-value">{name}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Description</div>
                <div className="info-value">
                  {description || "No description provided."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <MapPin size={20} className="icon" /> Location & Contact
            </h2>
          </div>
          <div className="section-content">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <MapPin size={16} className="icon" /> Address
                </div>
                <div className="info-value">
                  PapaJohnsStreet, PapaJohnsCity, PapaJohnsState, Sri Lanka
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Phone size={16} className="icon" /> Phone
                </div>
                <div className="info-value">(072) 111-2233</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Mail size={16} className="icon" /> Email
                </div>
                <div className="info-value">contact@pastaparadise.com</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Globe size={16} className="icon" /> Website
                </div>
                <div className="info-value">
                  <a
                    href="https://www.pastaparadise.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.pastaparadise.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Clock size={20} className="icon" /> Business Hours
            </h2>
          </div>
          <div className="section-content hours-grid">
            <div className="hours-item">
              <div className="day-name">Opening Hour</div>
              <div className="hours-value">{opening_hour || "00:00"}</div>
            </div>
            <div className="hours-item">
              <div className="day-name">Closing Hour</div>
              <div className="hours-value">{closing_hour || "24:00"}</div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Globe size={20} className="icon" /> Social Media
            </h2>
          </div>
          <div className="section-content">
            <div className="social-links">
              {facebook_link && (
                <a
                  href={facebook_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <Facebook size={20} className="icon" /> Facebook
                </a>
              )}
              {instagram_link && (
                <a
                  href={instagram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <Instagram size={20} className="icon" /> Instagram
                </a>
              )}
              {twitter_link && (
                <a
                  href={twitter_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <Twitter size={20} className="icon" /> Twitter
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Primary Contact Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <User size={20} className="icon" /> Primary Contact
            </h2>
          </div>
          <div className="section-content">
            <div className="contact-person">
              <div className="contact-avatar">
                <User size={48} />
              </div>
              <div className="contact-details">
                <h3 className="contact-name">Jessica Wilson</h3>
                <p className="contact-position">
                  <Briefcase size={14} className="icon" /> Spa Manager
                </p>
                <p className="contact-phone">
                  <Phone size={14} className="icon" /> (310) 555-9241
                </p>
                <p className="contact-email">
                  <Mail size={14} className="icon" />{" "}
                  jessica@coastalbreezespa.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
