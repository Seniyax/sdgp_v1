/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style/FloorPlan.css";
import { AnimatePresence, motion } from "framer-motion";
import FloorPlanLayout from "./FloorPlanLayout";
import FloorPlanStep1 from "./FloorPlanStep1";
import FloorPlanStep2 from "./FloorPlanStep2";
import FloorPlanStep3 from "./FloorPlanStep3";
import FloorPlanWaiting from "./FloorPlanWaiting";
import FloorPlanSuccess from "./FloorPlanSuccess";
import FloorPlanFaliure from "./FloorPlanFaliure";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY || "fallback-secret-key";

function FloorPlanDesigner() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { businessId: rawEncryptedBusinessId } = useParams();
  const encryptedBusinessId = decodeURIComponent(rawEncryptedBusinessId);

  let decryptedBusinessId = encryptedBusinessId;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedBusinessId, secretKey);
    decryptedBusinessId = bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting businessId:", error);
  }

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user || !rawEncryptedBusinessId) {
      navigate("/");
    }
  }, [navigate, rawEncryptedBusinessId]);

  const [currentStep, setCurrentStep] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [floorCount, setFloorCount] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [floorNames, setFloorNames] = useState([]);
  const [floorShapes, setFloorShapes] = useState([]);
  const [floorTables, setFloorTables] = useState([]);
  const [direction, setDirection] = useState(1);
  const [backendSuccess, setBackendSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [transitionType, setTransitionType] = useState("default");
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessById = async () => {
      try {
        const response = await axios.post("/api/business/get-by-id", {
          business_id: decryptedBusinessId,
        });

        if (response.data.success) {
          const { business } = response.data.data;
          if (!business.is_verified) {
            Swal.fire({
              title: "Verification Pending",
              text: "Your business has been created, but your primary email has not yet been verified. Please check your email for further instructions.",
              icon: "warning",
              confirmButtonText: "Okay",
            }).then(() => {
              navigate("/manage-business");
            });
          }
        } else {
          throw new Error(response.data.message || "Failed to fetch business");
        }
      } catch (err) {
        console.error("Error fetching business:", err.message);
      }
    };

    if (decryptedBusinessId) {
      fetchBusinessById();
    }
  }, [decryptedBusinessId, navigate]);

  useEffect(() => {
    const fetchFloorPlan = async () => {
      setIsDataLoading(true);
      const startTime = Date.now();
      try {
        const response = await axios.post("/api/floor-plan/get", {
          business_id: decryptedBusinessId,
        });
        if (response.data.success) {
          const floors = response.data.floors;
          if (floors && floors.length > 0) {
            setFloorCount(floors.length);
            setFloorNames(floors.map((floor) => floor.floor_name));
            setCanvasWidth(floors[0].canvas_width);
            setCanvasHeight(floors[0].canvas_height);
            setWidth(floors[0].width);
            setHeight(floors[0].height);

            const shapes = floors.map((floor) => {
              const parsedPlan = JSON.parse(floor.floor_plan);
              return parsedPlan.shapes || [];
            });
            const tables = floors.map((floor) => {
              const parsedPlan = JSON.parse(floor.floor_plan);
              return parsedPlan.tables || [];
            });
            setFloorShapes(shapes);
            setFloorTables(tables);
          }
        }
      } catch (err) {
        console.error("Error fetching floor plan", err);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const delayTime = Math.max(4000 - elapsedTime, 0);
        await new Promise((resolve) => setTimeout(resolve, delayTime));
        setIsDataLoading(false);
      }
    };

    if (decryptedBusinessId) {
      fetchFloorPlan();
    }
  }, [decryptedBusinessId]);

  const variants = {
    enter: ({ direction, transitionType }) => {
      if (
        transitionType === "step2to3" ||
        transitionType === "step3to2" ||
        transitionType === "waiting"
      ) {
        return { opacity: 0, x: 0, transition: { duration: 0.1 } };
      }
      return {
        opacity: 0,
        x: direction > 0 ? 250 : -250,
        transition: { duration: 0.45 },
      };
    },
    center: ({ transitionType }) => {
      if (
        transitionType === "step2to3" ||
        transitionType === "step3to2" ||
        transitionType === "waiting"
      ) {
        return { opacity: 1, x: 0, transition: { duration: 0.2 } };
      }
      return {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30,
          bounce: 0.3,
        },
      };
    },
    exit: ({ direction, transitionType }) => {
      if (
        transitionType === "step2to3" ||
        transitionType === "step3to2" ||
        transitionType === "waiting"
      ) {
        return { opacity: 0, x: 0, transition: { duration: 0.1 } };
      }
      return {
        opacity: 0,
        x: direction > 0 ? -250 : 250,
        transition: { duration: 0.45 },
      };
    },
  };

  const changeStep = (newStep, customTransitionType = null) => {
    setDirection(newStep > currentStep ? 1 : -1);
    if (customTransitionType) {
      setTransitionType(customTransitionType);
    } else if (currentStep === 2 && newStep === 3) {
      setTransitionType("step2to3");
    } else if (currentStep === 3 && newStep === 2) {
      setTransitionType("step3to2");
    } else {
      setTransitionType("default");
    }
    setTimeout(() => {
      setCurrentStep(newStep);
    }, 10);
  };

  const handleStep1Submit = (
    widthValue,
    heightValue,
    floorCountValue,
    names
  ) => {
    if (floorShapes.length === 0) {
      const newFloorShapes = Array.from({ length: floorCountValue }, () => []);
      const newFloorTables = Array.from({ length: floorCountValue }, () => []);
      setFloorShapes(newFloorShapes);
      setFloorTables(newFloorTables);
    } else {
      if (floorCountValue > floorCount) {
        const newFloorShapes = [...floorShapes];
        const newFloorTables = [...floorTables];
        for (let i = floorCount; i < floorCountValue; i++) {
          newFloorShapes.push([]);
          newFloorTables.push([]);
        }
        setFloorShapes(newFloorShapes);
        setFloorTables(newFloorTables);
      } else if (floorCountValue < floorCount) {
        setFloorShapes(floorShapes.slice(0, floorCountValue));
        setFloorTables(floorTables.slice(0, floorCountValue));
      }
    }

    setWidth(widthValue);
    setHeight(heightValue);

    const SIZE = 1000;
    const aspectRatio = widthValue / heightValue;
    const computedCanvasWidth = aspectRatio >= 1 ? SIZE : SIZE * aspectRatio;
    const computedCanvasHeight = aspectRatio >= 1 ? SIZE / aspectRatio : SIZE;
    setCanvasWidth(computedCanvasWidth);
    setCanvasHeight(computedCanvasHeight);

    setFloorCount(floorCountValue);
    setFloorNames(names);
    setCurrentFloor(0);
    changeStep(2);
  };

  const handleNextStep = async (shapes) => {
    if (currentStep === 2) {
      const updated = [...floorShapes];
      updated[currentFloor] = shapes.map((shape) => ({
        ...shape,
        rotation: shape.rotation || 0,
      }));
      setFloorShapes(updated);
      changeStep(3);
    } else if (currentStep === 3) {
      const updatedTables = reassignTableNumbers(floorTables);
      setFloorTables(updatedTables);

      const floorsPayload = floorShapes.map((floorPlan, i) => ({
        floor_name: floorNames[i] ? floorNames[i] : `Floor ${i + 1}`,
        floor_plan: JSON.stringify({
          shapes: floorPlan,
          tables: floorTables[i] || [],
        }),
      }));

      const tablesPayload = floorTables.flat().map((table) => ({
        id: table.id,
        seats: table.seatCount,
        table_number: table.tableNumber,
        floor: table.floor,
      }));

      const payload = {
        business_id: decryptedBusinessId,
        canvas_width: canvasWidth,
        canvas_height: canvasHeight,
        floors: floorsPayload,
        tables: tablesPayload,
        width: width,
        height: height,
      };

      setIsLoading(true);
      setSaveError(null);

      const startTime = Date.now();

      try {
        const response = await axios.post("/api/floor-plan/create", payload);
        console.log("Floor plan saved successfully", response.data);

        const elapsed = Date.now() - startTime;
        if (elapsed < 3000) {
          await new Promise((resolve) => setTimeout(resolve, 3000 - elapsed));
        }

        setBackendSuccess(true);
        setIsLoading(false);
        changeStep(4, "waiting");
      } catch (error) {
        console.error("Error saving floor plan", error);
        const elapsed = Date.now() - startTime;
        if (elapsed < 3000) {
          await new Promise((resolve) => setTimeout(resolve, 3000 - elapsed));
        }
        setBackendSuccess(false);
        setIsLoading(false);
        setSaveError("Error saving floor plan. Please try again.");
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 3) {
      changeStep(2);
    } else {
      setDirection(-1);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 10);
    }
  };

  const handleStep2Complete = (shapes) => {
    const updated = [...floorShapes];
    updated[currentFloor] = shapes.map((shape) => ({
      ...shape,
      rotation: shape.rotation || 0,
    }));
    setFloorShapes(updated);
    changeStep(3);
  };

  const reassignTableNumbers = (tablesPerFloor) => {
    let counter = 1;
    return tablesPerFloor.map((floor) =>
      floor.map((table) => ({
        ...table,
        tableNumber: counter++,
      }))
    );
  };

  const handleTableUpdate = (tables) => {
    let updated = [...floorTables];
    updated[currentFloor] = tables;
    updated = reassignTableNumbers(updated);
    setFloorTables(updated);
  };

  const renderFloorButtons = () => {
    return (
      <div
        style={{ display: "flex", flexDirection: "column-reverse", gap: "8px" }}
      >
        {Array.from({ length: floorCount }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFloor(index)}
            className={`btn ${
              currentFloor === index ? "btn-violet" : "btn-light"
            }`}
            style={{ width: "100px", transition: "all 0.2s ease" }}
          >
            {floorNames[index] ? floorNames[index] : `Floor ${index + 1}`}
          </button>
        ))}
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (isDataLoading || isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <FloorPlanWaiting
            message={
              isDataLoading ? "Loading floor plan details..." : undefined
            }
          />
        </div>
      );
    }

    if (saveError) {
      return (
        <FloorPlanFaliure
          error={saveError}
          tryAgain={() => {
            setSaveError(null);
            changeStep(1);
          }}
        />
      );
    }

    if (currentStep === 4) {
      return <FloorPlanSuccess businessId={decryptedBusinessId} />;
    }

    switch (currentStep) {
      case 1:
        return (
          <FloorPlanStep1
            onSubmit={handleStep1Submit}
            initialWidth={width}
            initialHeight={height}
            initialFloorCount={floorCount}
            initialFloorNames={floorNames}
          />
        );
      case 2:
        return (
          <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <div className="d-flex flex-column justify-content-center flex-grow-1">
              <FloorPlanStep2
                onNext={handleStep2Complete}
                initialShapes={floorShapes[currentFloor]}
                onShapesUpdate={(shapes) => {
                  const updated = [...floorShapes];
                  updated[currentFloor] = shapes.map((shape) => ({
                    ...shape,
                    rotation: shape.rotation || 0,
                  }));
                  setFloorShapes(updated);
                }}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
            <div className="d-flex flex-column justify-content-center flex-grow-1">
              <FloorPlanStep3
                onNext={handleNextStep}
                floorShapes={floorShapes[currentFloor]}
                initialTables={floorTables[currentFloor]}
                onTablesUpdate={handleTableUpdate}
                onPreviousStep={handlePreviousStep}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                currentFloorName={floorNames[currentFloor]}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepKey = () => {
    if (isLoading) return 4;
    if (currentStep >= 4) {
      return backendSuccess ? "success" : "failure";
    }
    return currentStep;
  };

  const showFixedButtons =
    !saveError &&
    typeof getStepKey() === "number" &&
    getStepKey() >= 2 &&
    getStepKey() < 4;

  return (
    <FloorPlanLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={getStepKey()}
          custom={{ direction, transitionType }}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showFixedButtons && (
          <motion.div
            key="floor-buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, delay: 0.4 },
            }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            style={{ position: "fixed", right: "300px", bottom: "70px" }}
            className="fixed-floor-buttons"
          >
            {renderFloorButtons()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFixedButtons && (
          <motion.div
            key="back-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, delay: 0.4 },
            }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            style={{
              position: "fixed",
              left: "20px",
              bottom: "20px",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => {
                setDirection(-1);
                changeStep(1);
              }}
              className="btn btn-light d-flex align-items-center"
            >
              <span className="me-2">&larr;</span> Back to Step 1
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </FloorPlanLayout>
  );
}

export default FloorPlanDesigner;
