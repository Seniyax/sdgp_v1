/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const noMarginRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/",
    "/business-join",
  ];
  const isFloorplanDesigner = location.pathname.startsWith(
    "/floorplan-designer"
  );
  const marginTop =
    noMarginRoutes.includes(location.pathname) || isFloorplanDesigner
      ? "0"
      : "100px";

  return <div style={{ marginTop }}>{children}</div>;
};

export default Layout;
