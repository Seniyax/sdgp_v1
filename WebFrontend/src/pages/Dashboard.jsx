import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utils/firebase"; // Updated import path - adjust if needed
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import "../style/Dashboard.css"; 

const Dashboard2 = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndBusinesses = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/sign-in');
          return;
        }
        
        setUser(currentUser);
        
        // Fetch businesses where user is the owner
        const ownerQuery = query(
          collection(db, 'businesses'),
          where('ownerId', '==', currentUser.uid)
        );
        const ownerSnapshot = await getDocs(ownerQuery);
        
        // Fetch businesses where user is an admin
        const adminQuery = query(
          collection(db, 'businessAdmins'),
          where('userId', '==', currentUser.uid)
        );
        const adminSnapshot = await getDocs(adminQuery);
        
        // Fetch businesses where user is staff
        const staffQuery = query(
          collection(db, 'businessStaff'),
          where('userId', '==', currentUser.uid)
        );
        const staffSnapshot = await getDocs(staffQuery);
        
        // Process owner businesses
        const ownerBusinesses = ownerSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().businessName,
          role: 'Owner',
          ...doc.data()
        }));
        
        // Process admin businesses (need to fetch actual business details)
        const adminBusinessIds = adminSnapshot.docs.map(doc => doc.data().businessId);
        const adminBusinesses = [];
        
        for (const businessId of adminBusinessIds) {
          const businessDocRef = doc(db, 'businesses', businessId);
          const businessDocSnap = await getDoc(businessDocRef);
          if (businessDocSnap.exists()) {
            adminBusinesses.push({
              id: businessId,
              name: businessDocSnap.data().businessName,
              role: 'Admin',
              ...businessDocSnap.data()
            });
          }
        }
        
        // Process staff businesses (need to fetch actual business details)
        const staffBusinessIds = staffSnapshot.docs.map(doc => doc.data().businessId);
        const staffBusinesses = [];
        
        for (const businessId of staffBusinessIds) {
          const businessDocRef = doc(db, 'businesses', businessId);
          const businessDocSnap = await getDoc(businessDocRef);
          if (businessDocSnap.exists()) {
            staffBusinesses.push({
              id: businessId,
              name: businessDocSnap.data().businessName,
              role: 'Staff',
              ...businessDocSnap.data()
            });
          }
        }
        
        // Combine all businesses
        setBusinesses([...ownerBusinesses, ...adminBusinesses, ...staffBusinesses]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setLoading(false);
      }
    };

    fetchUserAndBusinesses();
  }, [navigate]);

  const handleGoToSlotDashboard = (businessId, role) => {
    // Store the selected business info in sessionStorage for use in other components
    sessionStorage.setItem('selectedBusinessId', businessId);
    sessionStorage.setItem('selectedBusinessRole', role);
    navigate('/slot-dashboard');
  };

  const handleRegisterNewBusiness = () => {
    navigate('/register-business');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your businesses...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Businesses</h1>
        <div className="user-controls">
          <span className="user-email">{user?.email}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="businesses-grid">
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <div key={business.id} className="business-card">
              <div className="business-info">
                <h2 className="business-name">{business.name}</h2>
                <span className={`role-badge role-${business.role.toLowerCase()}`}>
                  {business.role}
                </span>
              </div>
              <div className="business-actions">
                <button 
                  className="primary-button" 
                  onClick={() => handleGoToSlotDashboard(business.id, business.role)}
                >
                  Go to Slot Dashboard
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-businesses">
            <p>You don't have any businesses yet.</p>
          </div>
        )}
      </div>

      <div className="dashboard-footer">
        <button className="add-business-button" onClick={handleRegisterNewBusiness}>
          Register New Business
        </button>
      </div>
    </div>
  );
};

export default Dashboard2;