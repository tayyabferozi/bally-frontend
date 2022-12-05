import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";

import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />

      <Container className="py-5">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
