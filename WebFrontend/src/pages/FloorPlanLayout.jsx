/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";

const AnimatedBalls = () => {
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newBall = {
        id: Date.now(),
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 20 + Math.random() * 30,
        animationDelay: Math.random() * 2,
      };

      setBalls((prev) => [...prev, newBall]);

      setTimeout(() => {
        setBalls((prev) => prev.filter((ball) => ball.id !== newBall.id));
      }, 7000);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
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
          zIndex: -100,
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
              boxShadow: "0px 6px 12px rgba(0,0,0,0.5)",
              opacity: 0, // start invisible
              transform: "scale(0.5)", // start scaled down
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
    const originalStyles = {
      background: document.body.style.background,
      backgroundRepeat: document.body.style.backgroundRepeat,
      backgroundAttachment: document.body.style.backgroundAttachment,
      backgroundSize: document.body.style.backgroundSize,
    };

    document.body.style.background = `
      linear-gradient(45deg,
        #320632 0%,
        #320632 65%,
        #4A214A 65%,
        #4A214A 90%,
        #ffffff 90%,
        #ffffff 100%
      )
    `;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";

    return () => {
      document.body.style.background = originalStyles.background;
      document.body.style.backgroundRepeat = originalStyles.backgroundRepeat;
      document.body.style.backgroundAttachment =
        originalStyles.backgroundAttachment;
      document.body.style.backgroundSize = originalStyles.backgroundSize;
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
