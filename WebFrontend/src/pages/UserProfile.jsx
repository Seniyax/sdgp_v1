/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    new_email: "",
    address: "",
    contact: "",
    username: "",
    new_username: "",
    profile_pic_url: "",
    bio: "",
    nic: "",
    dob: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    gender: "",
    marital_status: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (!storedUser) {
      navigate("/sign-in");
    } else {
      setUser(storedUser);
      // Populate form data with current user details and a default bio if not available
      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        new_email: "",
        address: storedUser.address || "",
        contact: storedUser.contact || "",
        username: storedUser.username || "",
        new_username: "",
        profile_pic_url: storedUser.profile_pic_url || "",
        bio:
          storedUser.bio ||
          "This is your default bio. Update it to tell us more about you.",
        nic: storedUser.nic || "",
        dob: storedUser.dob || "",
        twitter: storedUser.twitter || "",
        linkedin: storedUser.linkedin || "",
        facebook: storedUser.facebook || "",
        gender: storedUser.gender ? storedUser.gender.toLowerCase() : "",
        marital_status: storedUser.marital_status || "",
      });
    }
  }, [navigate]);

  // Handle change for each input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formPayload = new FormData();

      // Always send the current username
      formPayload.append("username", formData.username);

      // Only append fields if they are not empty and have been modified
      if (formData.name && formData.name !== user.name) {
        formPayload.append("name", formData.name);
      }
      if (formData.new_email) {
        formPayload.append("new_email", formData.new_email);
      }
      if (formData.address && formData.address !== user.address) {
        formPayload.append("address", formData.address);
      }
      if (formData.contact && formData.contact !== user.contact) {
        formPayload.append("contact", formData.contact);
      }
      if (formData.new_username) {
        formPayload.append("new_username", formData.new_username);
      }
      if (formData.bio && formData.bio !== user.bio) {
        formPayload.append("bio", formData.bio);
      }
      if (formData.nic && formData.nic !== user.nic) {
        formPayload.append("nic", formData.nic);
      }
      if (formData.dob && formData.dob !== user.dob) {
        formPayload.append("dob", formData.dob);
      }
      if (formData.twitter && formData.twitter !== user.twitter) {
        formPayload.append("twitter", formData.twitter);
      }
      if (formData.linkedin && formData.linkedin !== user.linkedin) {
        formPayload.append("linkedin", formData.linkedin);
      }
      if (formData.facebook && formData.facebook !== user.facebook) {
        formPayload.append("facebook", formData.facebook);
      }
      if (
        formData.gender &&
        formData.gender !== (user.gender ? user.gender.toLowerCase() : "")
      ) {
        formPayload.append("gender", formData.gender);
      }
      if (
        formData.marital_status &&
        formData.marital_status !== user.marital_status
      ) {
        formPayload.append("marital_status", formData.marital_status);
      }
      if (formData.profile_pic_url instanceof File) {
        formPayload.append("profile_pic_url", formData.profile_pic_url);
      }

      // If no changes detected (except the username, which is required)
      if ([...formPayload.entries()].length === 1) {
        setError("No changes detected.");
        setIsLoading(false);
        return;
      }

      const response = await axios.put("/api/user/update", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setEditMode(false);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while updating your profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    setError("");
    try {
      // Assuming your endpoint accepts DELETE with a request body
      const response = await axios.delete("/api/user/delete", {
        data: { username: user.username },
      });
      if (response.data.success) {
        sessionStorage.removeItem("user");
        navigate("/");
      } else {
        setError(response.data.message || "Failed to delete account");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while deleting your account."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!editMode) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={
                user?.profile_pic_url ||
                "/WebFrontend/src/assets/default_profile_picture.png"
              }
              alt={`${user?.name}'s avatar`}
            />
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <p className="profile-member">
              Member since {user?.created_at || "unknown"}
            </p>
          </div>
          <div className="profile-buttons">
            <button
              className="edit-profile-btn"
              onClick={() => setEditMode(true)}
            >
              <i className="icon-edit"></i> Edit Profile
            </button>
            <button
              className="manage-business-btn"
              onClick={() => navigate("/manage-business")}
            >
              Manage Businesses
            </button>
            <button
              className="delete-account-btn"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span>
                  Deleting<span className="dot-animation"></span>
                </span>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Profile Details Section */}
        <div className="profile-details">
          <div className="profile-details-bg">
            <div className="profile-section start">
              <h2>Personal Information</h2>
              <div className="profile-item">
                <strong>Email:</strong>
                <span>{user?.email}</span>
              </div>
              <div className="profile-item">
                <strong>NIC:</strong>
                <span>{user?.nic || "Not Provided"}</span>
              </div>
              <div className="profile-item">
                <strong>Address:</strong>
                <span>{user?.address || "Not Provided"}</span>
              </div>
              <div className="profile-item">
                <strong>Contact:</strong>
                <span>{user?.contact || "Not Provided"}</span>
              </div>
              <div className="profile-item">
                <strong>Username:</strong>
                <span>{user?.username}</span>
              </div>
              <div className="profile-item">
                <strong>Date of Birth:</strong>
                <span>{user?.dob || "Not Provided"}</span>
              </div>
              <hr className="divider" />
            </div>

            <div className="profile-section middle">
              <h2>Social Information</h2>
              <div className="profile-item">
                <strong>Twitter:</strong>
                <span>{user?.twitter || "Not Provided"}</span>
              </div>
              <div className="profile-item">
                <strong>LinkedIn:</strong>
                <span>{user?.linkedin || "Not Provided"}</span>
              </div>
              <div className="profile-item">
                <strong>Facebook:</strong>
                <span>{user?.facebook || "Not Provided"}</span>
              </div>
              <hr className="divider" />
            </div>

            <div className="profile-section end">
              <h2>Additional Details</h2>
              <div className="profile-item">
                <strong>Gender:</strong>
                <span>{user?.gender || "Not Provided"}</span>
              </div>
              <div className="profile-item">
                <strong>Marital Status:</strong>
                <span>{user?.marital_status || "Not Provided"}</span>
              </div>
              <div className="profile-item bio-item">
                <strong>Bio:</strong>
                <span>{formData.bio}</span>
              </div>
            </div>
          </div>
        </div>
        {error && <div className="profile-error">{error}</div>}
      </div>
    );
  }

  // If in edit mode, display update form with extra details including the new fields
  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <h2>Edit Profile</h2>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={formData.email} readOnly />
        </div>
        <div className="form-group">
          <label>New Email (optional)</label>
          <input
            name="new_email"
            value={formData.new_email}
            onChange={handleChange}
            type="email"
          />
        </div>
        <div className="form-group">
          <label>NIC</label>
          <input
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            placeholder="Enter NIC"
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contact</label>
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input name="username" value={formData.username} readOnly />
        </div>
        <div className="form-group">
          <label>New Username (optional)</label>
          <input
            name="new_username"
            value={formData.new_username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="form-group">
          <label>Twitter</label>
          <input
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="Twitter username"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn profile URL"
          />
        </div>
        <div className="form-group">
          <label>Facebook</label>
          <input
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="Facebook profile URL"
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Marital Status</label>
          <input
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            placeholder="Marital Status"
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Profile Picture</label>
          <input
            type="file"
            name="profile_pic_url"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                profile_pic_url: e.target.files[0],
              }))
            }
          />
        </div>
        {error && <div className="profile-error">{error}</div>}
        <div className="form-buttons">
          <button
            type="submit"
            className="edit-profile-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>
                Updating<span className="dot-animation"></span>
              </span>
            ) : (
              "Update Profile"
            )}
          </button>
          <button
            type="button"
            className="manage-business-btn"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
