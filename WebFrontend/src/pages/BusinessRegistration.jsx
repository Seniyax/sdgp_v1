/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Upload,
} from "lucide-react";
import "../style/BusinessRegistration.css";
import axios from "axios";
import Swal from "sweetalert2";

const BusinessRegistration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      navigate("/sign-in");
    } else if (!user.is_verified) {
      Swal.fire({
        title: "Not Signed In",
        text: "Please confirm your user email and sign in again.",
        icon: "warning",
        confirmButtonText: "Okay",
      }).then(() => {
        navigate("/sign-in");
      });
    }
  }, [navigate]);

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumbers: [{ number: "", label: "Primary" }],
    emails: [{ email: "", label: "Primary" }],
    website: "",
    starting_hour: "09:00",
    closing_hour: "22:00",
    logo: null,
    coverImage: null,
    images: [],
    reservationSlots: {
      defaultDuration: 30,
      capacity: 1,
      advance: 7,
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
    contactPerson: {
      name: "",
      position: "",
      phone: "",
      email: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState({
    logo: null,
    coverImage: null,
    images: [],
  });

  async function fetchCategories() {
    try {
      const response = await axios.get("/api/categories/");
      if (response.data.success && response.data.data) {
        setCategories(response.data.data.map((category) => category.name));
      } else {
        console.error("Failed to fetch categories:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNestedChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: value,
      },
    });
  };

  const handlePhoneChange = (index, event) => {
    const newPhoneNumbers = [...formData.phoneNumbers];
    newPhoneNumbers[index].number = event.target.value;
    setFormData({ ...formData, phoneNumbers: newPhoneNumbers });
  };

  const handleEmailChange = (index, event) => {
    const newEmails = [...formData.emails];
    newEmails[index].email = event.target.value;
    setFormData({ ...formData, emails: newEmails });
  };

  const handlePhoneLabelChange = (index, event) => {
    const newPhoneNumbers = [...formData.phoneNumbers];
    newPhoneNumbers[index].label = event.target.value;
    setFormData({ ...formData, phoneNumbers: newPhoneNumbers });
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [
        ...formData.phoneNumbers,
        { number: "", label: "Secondary" },
      ],
    });
  };

  const handleHoursChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (type === "logo" || type === "coverImage") {
        setFormData({
          ...formData,
          [type]: file,
        });

        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview({
            ...preview,
            [type]: event.target.result,
          });
        };
        reader.readAsDataURL(file);
      } else if (type === "images") {
        const newImages = [...formData.images];
        newImages.push(file);
        setFormData({
          ...formData,
          images: newImages,
        });

        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview({
            ...preview,
            images: [...preview.images, event.target.result],
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    let newErrors = {};

    if (step === 1) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required";
        isValid = false;
      }

      if (!formData.category) {
        newErrors.category = "Please select a category";
        isValid = false;
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
        isValid = false;
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required";
        isValid = false;
      }

      if (!formData.state.trim()) {
        newErrors.state = "State is required";
        isValid = false;
      }

      if (!formData.zipCode.trim()) {
        newErrors.zipCode = "ZIP code is required";
        isValid = false;
      }

      if (!formData.phoneNumbers[0].number.trim()) {
        newErrors.phone = "Phone number is required";
        isValid = false;
      }

      if (!formData.emails[0].email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.emails[0].email)) {
        newErrors.email = "Email is invalid";
        isValid = false;
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    setLoading(true);
    const user = JSON.parse(sessionStorage.getItem("user"));

    const formPayload = new FormData();
    formPayload.append("username", user ? user.username : "");
    formPayload.append("name", formData.businessName);
    formPayload.append("email_address", formData.emails[0].email);
    formPayload.append("location[line1]", formData.address);
    formPayload.append("location[line2]", formData.city);
    formPayload.append("location[line3]", formData.state);
    formPayload.append("location[country]", formData.country);
    formPayload.append("contacts", JSON.stringify(formData.phoneNumbers));
    formPayload.append("category_name", formData.category);
    formPayload.append("description", formData.description);
    formPayload.append("website", formData.website);

    if (formData.logo) {
      formPayload.append("logo", formData.logo);
    }
    if (formData.coverImage) {
      formPayload.append("cover", formData.coverImage);
    }

    formPayload.append("opening_hour", formData.starting_hour);
    formPayload.append("closing_hour", formData.closing_hour);
    formPayload.append("facebook_link", formData.socialMedia.facebook);
    formPayload.append("instagram_link", formData.socialMedia.instagram);
    formPayload.append("twitter_link", formData.socialMedia.twitter);

    try {
      const response = await axios.post("/api/business/register", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        sessionStorage.setItem(
          "business",
          JSON.stringify(response.data.data.business)
        );
        navigate("/floorplan-designer");
      } else {
        Swal.fire({
          title: "Error Occured",
          text: response.data.message || "Registration failed.",
          icon: "warning",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Error Occured",
        text: "An error occurred during registration. Please try again.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
          <div className="step-number">
            {currentStep > 1 ? <Check size={18} /> : 1}
          </div>
          <div className="step-label">Business Info</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
          <div className="step-number">
            {currentStep > 2 ? <Check size={18} /> : 2}
          </div>
          <div className="step-label">Location & Contact</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <div className="step-number">
            {currentStep > 3 ? <Check size={18} /> : 3}
          </div>
          <div className="step-label">Media & Hours</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
          <div className="step-number">4</div>
          <div className="step-label">Socials</div>
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
            <p>
              Let&apos;s start with some basic information about your business.
            </p>

            <div className="form-group">
              <label htmlFor="businessName">
                Business Name <span className="required">*</span>
              </label>
              <div className="input-container">
                <Building size={18} className="input-icon" />
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className={errors.businessName ? "error" : ""}
                />
              </div>
              {errors.businessName && (
                <div className="error-message">{errors.businessName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? "error" : ""}
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="error-message">{errors.category}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers about your business"
                rows="4"
                className={errors.description ? "error" : ""}
              ></textarea>
              {errors.description && (
                <div className="error-message">{errors.description}</div>
              )}
              <div className="helper-text">
                Brief description of your business that will appear on your
                profile (max 500 characters)
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
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
              <label htmlFor="address">
                Street Address <span className="required">*</span>
              </label>
              <div className="input-container">
                <MapPin size={18} className="input-icon" />
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  className={errors.address ? "error" : ""}
                />
              </div>
              {errors.address && (
                <div className="error-message">{errors.address}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">
                  City <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={errors.city ? "error" : ""}
                />
                {errors.city && (
                  <div className="error-message">{errors.city}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="state">
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={errors.state ? "error" : ""}
                />
                {errors.state && (
                  <div className="error-message">{errors.state}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">
                  ZIP Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                  className={errors.zipCode ? "error" : ""}
                />
                {errors.zipCode && (
                  <div className="error-message">{errors.zipCode}</div>
                )}
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

            {formData.phoneNumbers.map((phone, index) => (
              <div className="form-group" key={index}>
                <label htmlFor={`phone-${index}`}>
                  Phone Number ({phone.label}){" "}
                  <span className="required">*</span>
                </label>
                <div className="input-container">
                  <Phone size={10} className="input-icon" />
                  <input
                    type="tel"
                    id={`phone-${index}`}
                    name={`phone-${index}`}
                    value={phone.number}
                    onChange={(e) => handlePhoneChange(index, e)}
                    placeholder="Enter your phone number"
                    className={errors[`phone-${index}`] ? "error" : ""}
                  />
                  <select
                    value={phone.label}
                    onChange={(e) => handlePhoneLabelChange(index, e)}
                    className="phone-label-select"
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors[`phone-${index}`] && (
                  <div className="error-message">
                    {errors[`phone-${index}`]}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-phone"
              onClick={addPhoneNumber}
            >
              Add Another Phone
            </button>

            {formData.emails.map((email, index) => (
              <div className="form-group" key={index}>
                <label htmlFor={`email-${index}`}>
                  Business Email ({email.label}){" "}
                  <span className="required">*</span>
                </label>
                <div className="input-container">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    id={`email-${index}`}
                    name={`email-${index}`}
                    value={email.email}
                    onChange={(e) => handleEmailChange(index, e)}
                    placeholder="Enter your business email"
                    className={errors[`email-${index}`] ? "error" : ""}
                  />
                  <select
                    value="Primary"
                    disabled
                    className="email-label-select"
                  >
                    <option value="Primary">Primary</option>
                  </select>
                </div>
                {errors[`email-${index}`] && (
                  <div className="error-message">
                    {errors[`email-${index}`]}
                  </div>
                )}
              </div>
            ))}

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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
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
                <div
                  className="upload-area"
                  onClick={() => document.getElementById("logoUpload").click()}
                >
                  {preview.logo ? (
                    <img
                      src={preview.logo}
                      alt="Logo Preview"
                      className="preview-image"
                    />
                  ) : (
                    <>
                      <Camera size={32} />
                      <span>Upload Logo</span>
                      <span className="upload-desc">
                        Click to upload (PNG, JPG, SVG)
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="logoUpload"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="upload-section">
              <h3>Cover Image</h3>
              <div className="upload-container">
                <div
                  className="upload-area cover-area"
                  onClick={() => document.getElementById("coverUpload").click()}
                >
                  {preview.coverImage ? (
                    <img
                      src={preview.coverImage}
                      alt="Cover Preview"
                      className="preview-image"
                    />
                  ) : (
                    <>
                      <Upload size={32} />
                      <span>Upload Cover Image</span>
                      <span className="upload-desc">
                        Recommended: 1200x300 pixels
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="coverUpload"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "coverImage")}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="hours-section">
              <h3>Business Hours</h3>
              <div className="hours-container">
                <div className="hours-row">
                  <div className="label">Open Time</div>
                  <div className="hours-inputs">
                    <input
                      type="time"
                      value={formData.starting_hour}
                      onChange={(e) =>
                        handleHoursChange("starting_hour", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="hours-row">
                  <div className="label">Close Time</div>
                  <div className="hours-inputs">
                    <input
                      type="time"
                      value={formData.closing_hour}
                      onChange={(e) =>
                        handleHoursChange("closing_hour", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="social-section">
              <h3>Social Media (Optional)</h3>
              <div className="form-group">
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="text"
                  id="facebook"
                  placeholder="https://facebook.com/yourbusiness"
                  value={formData.socialMedia.facebook}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "facebook",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="instagram">Instagram</label>
                <input
                  type="text"
                  id="instagram"
                  placeholder="https://instagram.com/yourbusiness"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    handleNestedChange(
                      "socialMedia",
                      "instagram",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="text"
                  id="twitter"
                  placeholder="https://twitter.com/yourbusiness"
                  value={formData.socialMedia.twitter}
                  onChange={(e) =>
                    handleNestedChange("socialMedia", "twitter", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
                disabled={loading}
              >
                Back
              </button>
              {loading ? (
                <div className="loading-indicator">Registering...</div>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={handleSubmit}
                >
                  Complete Registration
                </button>
              )}
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

      <form className="registration-form">{renderStepContent()}</form>

      <div className="registration-footer">
        <p>Need help? Contact our support team at support@slotzi.com</p>
      </div>
    </div>
  );
};

export default BusinessRegistration;
