// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const AppNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Poll localStorage every second to update user state
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("access_token");
      const username = localStorage.getItem("username");
      if (token && username) {
        setUser(username);
      } else {
        setUser(null);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/"); // redirect to Home after logout
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Engine Health</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/predict">Predict</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Current Prediction</Nav.Link>
            <Nav.Link as={Link} to="/history">History</Nav.Link>
            {user ? (
              <NavDropdown title={`Welcome, ${user}`} id="user-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
