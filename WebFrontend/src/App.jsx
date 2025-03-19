// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Import pages
import Home from "./pages/Home";
import FloorPlanDesigner from "./pages/FloorPlanDesigner";
import ReservationDashboard from "./pages/ReservationDashboard";
import BusinessChoice from "./pages/BusinessChoice"; // Import BusinessChoice page
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessDashboard from "./pages/BusinessDashboard";
import Verification from "./pages/Verification";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import BusinessJoin from "./pages/BusinessJoin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/floorplan" element={<FloorPlanDesigner />} />
        <Route path="/reservationDashboard" element={<ReservationDashboard />} />
        <Route path="/business-choice" element={<BusinessChoice />} /> 
        <Route path="/business-registration" element={<BusinessRegistration />} /> 
        <Route path="/business-dashboard" element={<BusinessDashboard />} /> 
        <Route path="/verification" element={<Verification />} /> 
        <Route path="/sign-in" element={<SignIn />} /> 
        <Route path="/sign-up" element={<SignUp />} /> 
        <Route path="/business-join" element={<BusinessJoin />} /> 
      </Routes>
    </Router>
  );
}

export default App;
