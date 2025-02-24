import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/home';  // Adjust the path if needed
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
