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
} from "lucide-react";
import Swal from "sweetalert2";
import "../style/BusinessDashboard.css";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY || "fallback-secret-key";

const BusinessDashboard = () => {
  const { businessId: rawEncryptedBusinessId } = useParams();
  const encryptedBusinessId = decodeURIComponent(rawEncryptedBusinessId);
  let decryptedBusinessId = encryptedBusinessId;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedBusinessId, secretKey);
    decryptedBusinessId = bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting businessId:", error);
  }

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_name: "",
    website: "",
    line1: "",
    line2: "",
    line3: "",
    country: "",
    opening_hour: "",
    closing_hour: "",
    facebook_link: "",
    instagram_link: "",
    twitter_link: "",
    logo: "",
    cover: "",
  });

  // New states for emails, contacts, and user relations
  const [emailData, setEmailData] = useState([]);
  const [initialEmails, setInitialEmails] = useState([]);
  const [contactsData, setContactsData] = useState([]);
  const [initialContacts, setInitialContacts] = useState([]);
  const [relationsData, setRelationsData] = useState([]);
  const [initialRelations, setInitialRelations] = useState([]);
  const [emailTypes, setEmailTypes] = useState([]);

  // Fetch available email types
  const fetchEmailTypes = async () => {
    try {
      const response = await axios.get("/api/email/get-types");
      if (response.data.success) {
        setEmailTypes(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch email types", err);
    }
  };

  const fetchBusiness = useCallback(async () => {
    try {
      const response = await axios.post("/api/business/get-by-id", {
        business_id: decryptedBusinessId,
      });
      if (response.data.success && response.data.data) {
        setDashboardData(response.data.data);
        const {
          business,
          location,
          emails,
          contacts,
          business_user_relations,
        } = response.data.data;
        setFormData({
          name: business.name || "",
          description: business.description || "",
          category_name: (business.category && business.category.name) || "",
          website: business.website || "",
          line1: (location && location.line1) || "",
          line2: (location && location.line2) || "",
          line3: (location && location.line3) || "",
          country: (location && location.country) || "",
          opening_hour: business.opening_hour || "",
          closing_hour: business.closing_hour || "",
          facebook_link: business.facebook_link || "",
          instagram_link: business.instagram_link || "",
          twitter_link: business.twitter_link || "",
          logo: "",
          cover: "",
        });
        sessionStorage.setItem(
          "business",
          JSON.stringify(response.data.data.business)
        );
        setEmailData(emails || []);
        setInitialEmails(emails || []);
        setContactsData(contacts || []);
        setInitialContacts(contacts || []);
        const nonOwnerRelations = (business_user_relations || []).filter(
          (rel) => rel.type.toLowerCase() !== "owner"
        );
        const normalizedRelations = nonOwnerRelations.map((rel) => ({
          id: rel.id,
          username: (rel.user && rel.user.username) || "",
          type: rel.type || "",
        }));
        setRelationsData(normalizedRelations);
        setInitialRelations(normalizedRelations);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to fetch business data.",
          "error"
        ).then(() => window.location.reload());
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || err.message,
        "error"
      ).then(() => window.location.reload());
    } finally {
      setLoading(false);
      setUpdateLoading(false);
    }
  }, [decryptedBusinessId]);

  useEffect(() => {
    Promise.all([fetchEmailTypes(), fetchBusiness()]).catch((err) =>
      console.error(err)
    );
  }, [decryptedBusinessId, fetchBusiness]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || (!loading && !dashboardData)) {
      navigate("/");
    }
  }, [navigate, dashboardData, loading]);

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Business?",
      text: `Are you sure you want to delete ${dashboardData.business.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Business",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete("/api/business/delete", {
            data: { business_id: decryptedBusinessId },
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Email handlers
  const handleEmailChange = (index, field, value) => {
    setEmailData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddEmail = () => {
    setEmailData((prev) => [
      ...prev,
      { email_type: { name: "Sales" }, email_address: "", id: null },
    ]);
  };

  const handleRemoveEmail = (index) => {
    setEmailData((prev) => prev.filter((_, i) => i !== index));
  };

  // Contacts handlers
  const handleContactChange = (index, value) => {
    setContactsData((prev) => {
      const updated = [...prev];
      updated[index] = { number: value };
      return updated;
    });
  };

  const handleAddContact = () => {
    setContactsData((prev) => [...prev, { number: "" }]);
  };

  const handleRemoveContact = (index) => {
    setContactsData((prev) => prev.filter((_, i) => i !== index));
  };

  // User relations handlers
  const handleRelationChange = (index, field, value) => {
    setRelationsData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddRelation = () => {
    setRelationsData((prev) => [...prev, { username: "", type: "Staff" }]);
  };

  const handleRemoveRelation = (index) => {
    setRelationsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // No inline error state is used—errors will be handled via Swal.

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const sessionBusiness = JSON.parse(sessionStorage.getItem("business"));
      const formPayload = new FormData();

      formPayload.append("business_id", decryptedBusinessId);
      formPayload.append("username", user.username);

      let changeCount = 0;
      if (formData.name && formData.name !== sessionBusiness.name) {
        formPayload.append("updates[name]", formData.name);
        changeCount++;
      }
      if (
        formData.description &&
        formData.description !== sessionBusiness.description
      ) {
        formPayload.append("updates[description]", formData.description);
        changeCount++;
      }
      if (
        formData.category_name &&
        formData.category_name !== (sessionBusiness.category?.name || "")
      ) {
        formPayload.append("updates[category_name]", formData.category_name);
        changeCount++;
      }
      if (formData.website && formData.website !== sessionBusiness.website) {
        formPayload.append("updates[website]", formData.website);
        changeCount++;
      }
      const locationUpdates = {
        line1: formData.line1,
        line2: formData.line2,
        line3: formData.line3,
        country: formData.country,
      };
      if (
        formData.line1 ||
        formData.line2 ||
        formData.line3 ||
        formData.country
      ) {
        formPayload.append(
          "updates[location]",
          JSON.stringify(locationUpdates)
        );
        changeCount++;
      }
      if (
        formData.opening_hour &&
        formData.opening_hour !== sessionBusiness.opening_hour
      ) {
        formPayload.append("updates[opening_hour]", formData.opening_hour);
        changeCount++;
      }
      if (
        formData.closing_hour &&
        formData.closing_hour !== sessionBusiness.closing_hour
      ) {
        formPayload.append("updates[closing_hour]", formData.closing_hour);
        changeCount++;
      }
      if (
        formData.facebook_link &&
        formData.facebook_link !== sessionBusiness.facebook_link
      ) {
        formPayload.append("updates[facebook_link]", formData.facebook_link);
        changeCount++;
      }
      if (
        formData.instagram_link &&
        formData.instagram_link !== sessionBusiness.instagram_link
      ) {
        formPayload.append("updates[instagram_link]", formData.instagram_link);
        changeCount++;
      }
      if (
        formData.twitter_link &&
        formData.twitter_link !== sessionBusiness.twitter_link
      ) {
        formPayload.append("updates[twitter_link]", formData.twitter_link);
        changeCount++;
      }
      if (formData.logo instanceof File) {
        formPayload.append("logo", formData.logo);
        changeCount++;
      }
      if (formData.cover instanceof File) {
        formPayload.append("cover", formData.cover);
        changeCount++;
      }
      if (JSON.stringify(emailData) !== JSON.stringify(initialEmails)) {
        formPayload.append("updates[emails]", JSON.stringify(emailData));
        changeCount++;
      }
      if (JSON.stringify(contactsData) !== JSON.stringify(initialContacts)) {
        formPayload.append("updates[contacts]", JSON.stringify(contactsData));
        changeCount++;
      }
      if (JSON.stringify(relationsData) !== JSON.stringify(initialRelations)) {
        formPayload.append(
          "updates[user_relations]",
          JSON.stringify(relationsData)
        );
        changeCount++;
      }
      for (const [key, value] of formPayload.entries()) {
        console.log(key, value);
      }
      if (changeCount === 0) {
        Swal.fire("No Changes", "No changes detected.", "info");
        setIsSubmitting(false);
        return;
      }
      const response = await axios.put("/api/business/update", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        Swal.fire("Updated!", "Business updated successfully.", "success").then(
          () => {
            setEditMode(false);
            fetchBusiness();
          }
        );
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to update business",
          "error"
        ).then(() => {
          window.location.reload();
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "An error occurred while updating the business.",
        "error"
      ).then(() => {
        window.location.reload();
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || updateLoading) {
    return (
      <div className="business-db-loading-container">
        <div className="business-db-loading-spinner"></div>
        <p>Loading business data...</p>
      </div>
    );
  }

  const { business, location, emails, contacts, business_user_relations } =
    dashboardData;
  const {
    name,
    description,
    website,
    logo,
    cover,
    opening_hour,
    closing_hour,
    facebook_link,
    instagram_link,
    twitter_link,
  } = business;
  const defaultLogo = "/default-logo.png";
  const defaultCover = "/default-cover.jpg";

  if (!editMode) {
    return (
      <div className="business-dashboard">
        <div
          className="business-db-dashboard-header"
          style={{ backgroundImage: `url(${cover || defaultCover})` }}
        >
          <div className="business-db-header-overlay">
            <div className="business-db-business-logo">
              <img src={logo || defaultLogo} alt={`${name} logo`} />
            </div>
            <div className="business-db-business-header-info">
              <h1 className="business-db-business-name">{name}</h1>
              {business.category && business.category.name && (
                <p className="business-db-business-category">
                  {business.category.name}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="business-db-dashboard-actions">
          <button
            className="business-db-btn business-db-edit-btn"
            onClick={() => setEditMode(true)}
          >
            <User size={16} className="business-db-icon" /> Edit Business
          </button>
          <button
            className="business-db-btn business-db-btn-danger"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="business-db-icon" /> Delete Business
          </button>
        </div>
        <div className="business-db-dashboard-content">
          <div className="business-db-business-card">
            <div className="business-db-business-card-header">
              <Building size={20} className="business-db-icon" /> Business
              Overview
            </div>
            <div className="business-db-business-card-body">
              <div className="business-db-info-item">
                <div className="business-db-info-label">Name:</div>
                <div className="business-db-info-value">{name}</div>
              </div>
              <div className="business-db-info-item">
                <div className="business-db-info-label">Description:</div>
                <div className="business-db-info-value">
                  {description || "No description provided."}
                </div>
              </div>
              {website && (
                <div className="business-db-info-item">
                  <div className="business-db-info-label">Website:</div>
                  <div className="business-db-info-value">{website}</div>
                </div>
              )}
            </div>
          </div>
          {location && (
            <div className="business-db-business-card">
              <div className="business-db-business-card-header">
                <MapPin size={20} className="business-db-icon" /> Location
              </div>
              <div className="business-db-business-card-body">
                <div className="business-db-info-item">
                  <div className="business-db-info-label">Line 1:</div>
                  <div className="business-db-info-value">
                    {location.line1 || "N/A"}
                  </div>
                </div>
                <div className="business-db-info-item">
                  <div className="business-db-info-label">Line 2:</div>
                  <div className="business-db-info-value">
                    {location.line2 || "N/A"}
                  </div>
                </div>
                <div className="business-db-info-item">
                  <div className="business-db-info-label">Line 3:</div>
                  <div className="business-db-info-value">
                    {location.line3 || "N/A"}
                  </div>
                </div>
                <div className="business-db-info-item">
                  <div className="business-db-info-label">Country:</div>
                  <div className="business-db-info-value">
                    {location.country || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}
          {emails && emails.length > 0 && (
            <div className="business-db-business-card">
              <div className="business-db-business-card-header">
                <Mail size={20} className="business-db-icon" /> Emails
              </div>
              <div className="business-db-business-card-body">
                {emails.map((email) => (
                  <div key={email.id} className="business-db-info-item">
                    <div className="business-db-info-label">
                      {(email.email_type && email.email_type.name) ||
                        email.email_type ||
                        "Email"}
                      :
                    </div>
                    <div className="business-db-info-value">
                      {email.email_address}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {contacts && contacts.length > 0 && (
            <div className="business-db-business-card">
              <div className="business-db-business-card-header">
                <Phone size={20} className="business-db-icon" /> Contacts
              </div>
              <div className="business-db-business-card-body">
                {contacts.map((contact, index) => (
                  <div key={index} className="business-db-info-item">
                    <div className="business-db-info-label">
                      Contact {index + 1}:
                    </div>
                    <div className="business-db-info-value">
                      {contact.number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(opening_hour || closing_hour) && (
            <div className="business-db-business-card">
              <div className="business-db-business-card-header">
                <Clock size={20} className="business-db-icon" /> Business Hours
              </div>
              <div className="business-db-business-card-body business-db-hours-grid">
                <div className="business-db-hours-item">
                  <div className="business-db-day-name">Opening:</div>
                  <div className="business-db-hours-value">
                    {opening_hour || "00:00:00"}
                  </div>
                </div>
                <div className="business-db-hours-item">
                  <div className="business-db-day-name">Closing:</div>
                  <div className="business-db-hours-value">
                    {closing_hour || "24:00:00"}
                  </div>
                </div>
              </div>
            </div>
          )}
          {(facebook_link || instagram_link || twitter_link) && (
            <div className="business-db-business-card">
              <div className="business-db-business-card-header">
                <Globe size={20} className="business-db-icon" /> Social Media
              </div>
              <div className="business-db-business-card-body business-db-social-links">
                {facebook_link && (
                  <a
                    href={facebook_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-db-social-link business-db-facebook"
                  >
                    <Facebook size={20} className="business-db-icon" /> Facebook
                  </a>
                )}
                {instagram_link && (
                  <a
                    href={instagram_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-db-social-link business-db-instagram"
                  >
                    <Instagram size={20} className="business-db-icon" />{" "}
                    Instagram
                  </a>
                )}
                {twitter_link && (
                  <a
                    href={twitter_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="business-db-social-link business-db-twitter"
                  >
                    <Twitter size={20} className="business-db-icon" /> Twitter
                  </a>
                )}
              </div>
            </div>
          )}
          {business_user_relations && business_user_relations.length > 0 && (
            <div className="business-db-business-card">
              <div className="business-db-business-card-header">
                <User size={20} className="business-db-icon" /> Business Users
              </div>
              <div className="business-db-business-card-body">
                {business_user_relations.map((relation) => (
                  <div
                    key={relation.id}
                    className="business-db-info-item relation-item"
                  >
                    <div className="business-db-info-label">
                      {relation.type}:
                    </div>
                    <div className="business-db-info-value">
                      {relation.user && relation.user.name}{" "}
                      {relation.user && relation.user.username && (
                        <span className="business-db-relation-username">
                          (@{relation.user.username})
                        </span>
                      )}
                      {relation.type.toLowerCase() !== "owner" &&
                        relation.supervisor &&
                        relation.supervisor.id !== relation.user.id && (
                          <div className="business-db-supervisor-info">
                            Supervisor: {relation.supervisor.name}{" "}
                            {relation.supervisor.username && (
                              <span className="business-db-relation-username">
                                (@{relation.supervisor.username})
                              </span>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit mode: update form with dynamic rows
  return (
    <div className="business-dashboard">
      <form onSubmit={handleSubmit} className="business-db-business-edit-form">
        <h2>Edit Business</h2>
        <div className="business-db-form-group">
          <label>Business Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="business-db-form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <div className="business-db-form-group">
          <label>Category Name</label>
          <input
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
          />
        </div>
        <div className="business-db-form-group">
          <label>Website</label>
          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <div className="business-db-form-group">
          <label>Address Line 1</label>
          <input name="line1" value={formData.line1} onChange={handleChange} />
        </div>
        <div className="business-db-form-group">
          <label>Address Line 2</label>
          <input name="line2" value={formData.line2} onChange={handleChange} />
        </div>
        <div className="business-db-form-group">
          <label>Address Line 3</label>
          <input name="line3" value={formData.line3} onChange={handleChange} />
        </div>
        <div className="business-db-form-group">
          <label>Country</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>
        <div className="business-db-form-group">
          <label>Opening Hour</label>
          <input
            name="opening_hour"
            value={formData.opening_hour}
            onChange={handleChange}
            placeholder="e.g. 08:00"
          />
        </div>
        <div className="business-db-form-group">
          <label>Closing Hour</label>
          <input
            name="closing_hour"
            value={formData.closing_hour}
            onChange={handleChange}
            placeholder="e.g. 18:00"
          />
        </div>
        <div className="business-db-form-group">
          <label>Facebook Link</label>
          <input
            name="facebook_link"
            value={formData.facebook_link}
            onChange={handleChange}
          />
        </div>
        <div className="business-db-form-group">
          <label>Instagram Link</label>
          <input
            name="instagram_link"
            value={formData.instagram_link}
            onChange={handleChange}
          />
        </div>
        <div className="business-db-form-group">
          <label>Twitter Link</label>
          <input
            name="twitter_link"
            value={formData.twitter_link}
            onChange={handleChange}
          />
        </div>
        <div className="business-db-form-group">
          <label>Logo (optional)</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="business-db-form-group">
          <label>Cover Image (optional)</label>
          <input
            type="file"
            name="cover"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <h3>Edit Emails</h3>
        {emailData.map((email, index) => (
          <div className="business-db-dynamic-row" key={index}>
            <select
              value={
                typeof email.email_type === "object"
                  ? email.email_type.name
                  : email.email_type
              }
              onChange={(e) =>
                handleEmailChange(index, "email_type", { name: e.target.value })
              }
            >
              {emailTypes.map((et, i) => (
                <option key={i} value={et.name}>
                  {et.name}
                </option>
              ))}
            </select>
            <input
              type="email"
              value={email.email_address}
              onChange={(e) =>
                handleEmailChange(index, "email_address", e.target.value)
              }
              placeholder="Email Address"
            />
            <button
              type="button"
              className="business-db-remove-btn"
              onClick={() => handleRemoveEmail(index)}
            >
              –
            </button>
          </div>
        ))}
        <div className="business-db-add-container">
          <button
            type="button"
            className="business-db-add-btn"
            onClick={handleAddEmail}
          >
            + Add Email
          </button>
        </div>
        <h3>Edit Contacts</h3>
        {contactsData.map((contact, index) => (
          <div className="business-db-dynamic-row" key={index}>
            <select
              value={contact.type || "Primary"}
              onChange={(e) => {
                setContactsData((prev) => {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], type: e.target.value };
                  return updated;
                });
              }}
            >
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              value={contact.number}
              onChange={(e) => handleContactChange(index, e.target.value)}
              placeholder="Contact Number"
            />
            <button
              type="button"
              className="business-db-remove-btn"
              onClick={() => handleRemoveContact(index)}
            >
              –
            </button>
          </div>
        ))}
        <div className="business-db-add-container">
          <button
            type="button"
            className="business-db-add-btn"
            onClick={handleAddContact}
          >
            + Add Contact
          </button>
        </div>
        <h3>Edit Business Users</h3>
        {relationsData.map((relation, index) => (
          <div className="business-db-dynamic-row" key={index}>
            <input
              placeholder="Username"
              value={relation.username || ""}
              onChange={(e) =>
                handleRelationChange(index, "username", e.target.value)
              }
            />
            <select
              value={relation.type}
              onChange={(e) =>
                handleRelationChange(index, "type", e.target.value)
              }
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
            <button
              type="button"
              className="business-db-remove-btn"
              onClick={() => handleRemoveRelation(index)}
            >
              –
            </button>
          </div>
        ))}
        <div className="business-db-add-container">
          <button
            type="button"
            className="business-db-add-btn"
            onClick={handleAddRelation}
          >
            + Add Business User
          </button>
        </div>
        <div className="business-db-form-buttons">
          <button
            type="submit"
            className="business-db-btn business-db-edit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>
                Updating<span className="dot-animation"></span>
              </span>
            ) : (
              "Update Business"
            )}
          </button>
          <button
            type="button"
            className="business-db-btn business-db-cancel-btn"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessDashboard;
