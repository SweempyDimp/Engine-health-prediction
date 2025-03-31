// src/components/Register.js
import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Reuse the same CSS for consistent styling

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await axios.post("http://localhost:8000/register", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setMessage("Registration successful! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  // Optionally, add a button to redirect to login if already have an account
  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg login-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Register</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleRegister}>
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
                Register
              </Button>
            </div>
          </Form>
          <div className="mt-3 text-center">
            <Button variant="secondary" onClick={goToLogin}>
              Already have an account? Login
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
