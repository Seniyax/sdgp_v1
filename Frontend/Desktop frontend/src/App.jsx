import React from "react"
import "./App.css"

function App() {
    return (
        <div className="app">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="logo-container">
                        <h1>
                            <span>SLOT</span>
                            <span>Z1</span>
                        </h1>
                        <p className="tagline">
                            PLAN AHEAD,
                            <br />
                            SKIP THE LINES
                        </p>
                    </div>
                </div>
                <div className="hero-image"></div>
            </section>

            {/* What is SlotZi Section */}
            <section className="what-is">
                <div className="content-container">
                    <h2>WHAT IS SLOTZI ?</h2>
                    <p>
                        Our platform is designed to simplify your plans, allowing you to secure early reservations for your
                        favourite places be it restaurants, events, gyms, or co-working spaces with just a few clicks. What sets us
                        apart is our commitment to convenience and personalization.
                    </p>
                </div>
                <div className="curved-image what-is-image"></div>
            </section>

            {/* Mission Section */}
            <section className="mission">
                <div className="content-container">
                    <h2>
                        Our
                        <br />
                        Mission
                    </h2>
                    <p>
                        At SLOTZI, we believe your time is precious. Our mission is to streamline your reservations and planning, so
                        you can focus on the things that matter most—creating memories, not waiting in line.
                    </p>
                </div>
            </section>

            {/* Why SlotZi Section */}
            <section className="why-slotzi">
                <div className="curved-image why-image"></div>
                <div className="content-container">
                    <h2>Why SlotZi ?</h2>
                    <ul>
                        <li>
                            No More Long Waits: Early reservations ensure you never have to stand in line or worry about availability.
                        </li>
                        <li>Exclusive Offers: Get access to early-bird deals, discounts, and VIP slots through SLOTZI.</li>
                        <li>24/7 Access: Make reservations anytime, anywhere, at your convenience.</li>
                        <li>Verified Reviews: Trusted ratings and reviews help you choose the best spots for your plans.</li>
                        <li>Community Focused: Partnering with local businesses to bring you unique experiences.</li>
                    </ul>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="gallery">
                <h2>SlotZi</h2>
                <div className="gallery-grid">
                    <div className="gallery-item dining"></div>
                    <div className="gallery-item meeting"></div>
                    <div className="gallery-item video-call"></div>
                    <div className="gallery-item family"></div>
                </div>
            </section>
        </div>
    )
}

export default App

