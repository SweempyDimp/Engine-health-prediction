// src/components/Home.js
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <Container fluid className="home-container">
      <Row className="align-items-center min-vh-100">
        <Col md={{ span: 6, offset: 1 }} className="text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="display-3 fw-bold"
          >
            Engine Health Predictor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="lead"
          >
            Get real-time insights into your engine's performance and predict potential issues before they occur.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Button variant="primary" size="lg" as={Link} to="/predict">
              Get Started
            </Button>
          </motion.div>
        </Col>
        <Col md={5} className="d-none d-md-block">
          <motion.img
            src="/images/5557384.png" // Ensure your image is placed in public/images
            alt="Engine"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="img-fluid"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
