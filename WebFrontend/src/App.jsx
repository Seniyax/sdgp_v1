import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar"; // make sure this exists!
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
import Dashboard from "./pages/Dashboard"; // from HEAD, if you need it

const AppContent = () => {
  const location = useLocation();
  // Define routes where you DON'T want the Navbar to show up
  const noNavbarRoutes = ["/sign-in", "/sign-up"];

  return (
    <>
      {/* Render Navbar only if the current path is not in noNavbarRoutes */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route
          path="/business-registration"
          element={<BusinessRegistration />}
        />
        <Route path="/floorplan" element={<FloorPlanDesigner />} />
        <Route
          path="/reservationDashboard"
          element={<ReservationDashboard />}
        />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/business-join" element={<BusinessJoin />} />
        <Route path="/manage-business" element={<ManageBusiness />} />
        <Route path="/customer-support" element={<CustomerSupport />} />
        <Route path="/business-report" element={<BusinessReport />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
