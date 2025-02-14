import React from 'react';
import "../style/Home.css";
import SlotZi from "../assets/laptop and phone.png";
import SlotZitext from "../assets/SlotZitext-removebg-preview.png";
function Home() {
    return (
        <div className="container">
            <div className="box text-box">
                <img className="image1" src={SlotZitext} alt="SlotZi text" />
                <p>Buy without lifting a finger.</p>
                <button>Download the App</button>
            </div>
            <div className="box image-box">
                <img className="image" src={SlotZi} alt="SlotZi Image" />

            </div>
        </div>
    );
}

export default Home;
