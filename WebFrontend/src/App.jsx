// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Import pages
import Home from "./pages/Home";
import FloorPlanDesigner from "./pages/FloorPlanDesigner";
import ReservationDashboard from "./pages/ReservationDashboard";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/floorplan" element={<FloorPlanDesigner />} />
        <Route path="/reservationDashboard" element={<ReservationDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;