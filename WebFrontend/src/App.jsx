import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Import pages
import Home from "./pages/Home";
import FloorPlanDesigner from "./pages/FloorPlanDesigner";
import ReservationDashboard from "./pages/ReservationDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import Verification from "./pages/Verification";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import BusinessJoin from "./pages/BusinessJoin";
import ManageBusiness from "./pages/ManageBusiness";
import CustomerSupport from "./pages/CustomerSupport";
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessReport from "./pages/BusinessReport";
import UserProfile from "./pages/UserProfile";
// import dasboard from "./pages/dashboard";

<<<<<<< HEAD
const AppContent = () => {
  const location = useLocation();
  const noNavbarRoutes = [
    "/signin",
    "/signup",
    "/passwordconfirmation",
    "/businessform",
    "/floorplan",
    "/reservationDashboard",
  ];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/businessform" element={<Businessform />} />
        <Route path="/floorplan" element={<FloorPlanDesigner />} />
        <Route
          path="/reservationDashboard"
          element={<ReservationDashboard />}
        />
      </Routes>
    </>
  );
};
=======
>>>>>>> 8ea255932453cc9c4421459af6c450f921c8c62b

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/floorplan" element={<FloorPlanDesigner />} />
        <Route path="/reservationDashboard" element={<ReservationDashboard />} />
        <Route path="/business-registration" element={<BusinessRegistration />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/business-join" element={<BusinessJoin />} />
        <Route path="/manage-business" element={<ManageBusiness />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        <Route path="/business-report" element={<BusinessReport />} />
        <Route path="/user-profile" element={<UserProfile />} />
        {/*<Route path="/dashboard" element={<Dashboard />} />*/}
      </Routes>
    </Router>
  );
}

export default App;
