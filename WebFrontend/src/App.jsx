import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/Signin.jsx";
import SignUp from "./pages/Signup.jsx";
import Passwordconfirmation from "./pages/Passwordconfirmation.jsx";
import Businessform from "./pages/Businessform.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import Verification from "../src/pages/Verification.jsx";
import FloorPlanDesigner from "./pages/FloorPlanDesigner.jsx";
import ReservationDashboard from "./pages/ReservationDashboard.jsx";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const noNavbarRoutes = [
    "/signin",
    "/signup",
    "/passwordconfirmation",
    "/businessform",
    "/floorplan",
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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
