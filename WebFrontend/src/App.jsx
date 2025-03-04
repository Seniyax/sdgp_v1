import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/Signin.jsx';
import SignUp from './pages/Signup.jsx';
import Passwordconfirmation from './pages/Passwordconfirmation.jsx';
import Businessform from './pages/Businessform.jsx';
import './App.css';

const AppContent = () => {
    const location = useLocation();

    // Routes where the Navbar should NOT be displayed
    const noNavbarRoutes = ["/signin", "/signup", "/passwordconfirmation", "/businessform"];

    return (
        <>
            {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/passwordconfirmation" element={<Passwordconfirmation />} />
                <Route path="/businessform" element={<Businessform />} />
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
