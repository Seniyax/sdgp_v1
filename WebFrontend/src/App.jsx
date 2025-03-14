import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import SignIn from "./pages/Signin.jsx";
// import SignUp from "./pages/Signup.jsx";
// import Passwordconfirmation from "./pages/Passwordconfirmation.jsx";
// import Businessform from "./pages/Businessform.jsx";
// import Dashboard from "../src/pages/Dashboard.jsx";
// import Verification from "../src/pages/Verification.jsx";
import FloorPlanDesigner from "./pages/FloorPlanDesigner.jsx";
import "./App.css";

const AppContent = () => {
  const location = useLocation();

  // Hide the Navbar on any route that starts with "/floorplan"
  const hideNavbar = location.pathname.startsWith("/floorplan");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/passwordconfirmation"
          element={<Passwordconfirmation />}
        />
        <Route path="/businessform" element={<Businessform />} />
         <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verification" element={<Verification />} /> */}
        <Route path="/floorplan" element={<FloorPlanDesigner />} />
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
