/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const AnimatedBalls = () => {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    // Create a new ball every 5 seconds
    const intervalId = setInterval(() => {
      const newBall = {
        id: Date.now(),
        top: Math.random() * 100, // percentage of viewport height
        left: Math.random() * 100, // percentage of viewport width
        size: 20 + Math.random() * 30, // size between 20px and 50px
        animationDelay: Math.random() * 2, // random delay for animation
      };

      setBalls((prev) => [...prev, newBall]);

      // Remove the ball after 7 seconds for a smooth fade out
      setTimeout(() => {
        setBalls((prev) => prev.filter((ball) => ball.id !== newBall.id));
      }, 7000);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* Keyframe animation for smooth fade in/out */}
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1); }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -100, // very low so it remains in the background
        }}
      >
        {balls.map((ball) => (
          <div
            key={ball.id}
            style={{
              position: "absolute",
              top: `${ball.top}%`,
              left: `${ball.left}%`,
              width: ball.size,
              height: ball.size,
              background: "#ffffff",
              borderRadius: "50%",
              boxShadow: "0px 6px 12px rgba(0,0,0,0.5)", // smoother shadow effect
              animation: `fadeInOut 5s ease-in-out forwards`,
              animationDelay: `${ball.animationDelay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

const FloorPlanLayout = ({ children }) => {
  useEffect(() => {
    // Save the original background style
    const originalBg = document.body.style.background;
    // Set a gradient background:
    // Main color: #2E0428 (0-65%)
    // Lighter maroon: #4C2246 (65-90%)
    // White: (90-100% in the top right)
    document.body.style.background = `
      linear-gradient(45deg,
        #2E0428 0%,
        #2E0428 65%,
        #4C2246 65%,
        #4C2246 90%,
        #ffffff 90%,
        #ffffff 100%
      )
    `;

    // Cleanup: reset background style when component unmounts
    return () => {
      document.body.style.background = originalBg;
    };
  }, []);

  return (
    <>
      <AnimatedBalls />
      {children}
    </>
  );
};

export default FloorPlanLayout;
