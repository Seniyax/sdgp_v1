/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const AppContent = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verification" element={<Verification />} />
        <Route
          path="/business-registration"
          element={<BusinessRegistration />}
        />
        <Route path="/floorplan-designer" element={<FloorPlanDesigner />} />
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
