// src/components/Login.js
import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await axios.post(
        "http://localhost:8000/token",
        new URLSearchParams(formData),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      // Store token and username in localStorage
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("username", formData.username);
      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }
  };

  // Optionally, you could add a "Register" button on this page if the user doesn't have an account.
  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg login-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
          <div className="mt-3 text-center">
            <Button variant="secondary" onClick={goToRegister}>
              Register
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
