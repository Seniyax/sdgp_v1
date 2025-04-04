/* eslint-disable no-unused-vars */
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import FloorPlanDesigner from "./pages/FloorPlanDesigner";
import ReservationDashboard from "./pages/ReservationDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import Verification from "./pages/Verification";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import BusinessJoin from "./pages/BusinessJoin";
import ManageBusiness from "./pages/ManageBusiness";
import CustomerSupport from "./pages/CustomerSupport";
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessReport from "./pages/BusinessReport";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/NavBar";
import Layout from "./components/Layout";

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/business-registration" element={<BusinessRegistration />} />
      <Route
        path="/floorplan-designer/:businessId"
        element={<FloorPlanDesigner />}
      />
      <Route
        path="/reservation-dashboard/:businessId"
        element={<ReservationDashboard />}
      />
      <Route
        path="/business-dashboard/:businessId"
        element={<BusinessDashboard />}
      />
      <Route path="/business-join" element={<BusinessJoin />} />
      <Route path="/manage-business" element={<ManageBusiness />} />
      <Route path="/customer-support" element={<CustomerSupport />} />
      <Route path="/business-report" element={<BusinessReport />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

const AppWrapper = () => {
  const location = useLocation();
  const noNavbarRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

  const isFloorplanDesigner = location.pathname.startsWith(
    "/floorplan-designer"
  );

  const showNavbar = !(
    noNavbarRoutes.includes(location.pathname) || isFloorplanDesigner
  );

  return (
    <>
      {showNavbar && <Navbar />}
      <Layout>
        <AppContent />
      </Layout>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
