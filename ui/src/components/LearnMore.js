// src/components/LearnMore.js
import React from "react";
import { Container, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import "./LearnMore.css"; // Optional: your custom styles

const LearnMore = () => {
  return (
    <Container className="my-5">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow">
          <Card.Body>
            <Card.Title>About Engine Health Predictor</Card.Title>
            <Card.Text>
              Our Engine Health Predictor uses advanced AI models to analyze engine performance data and predict potential issues before they become critical.
            </Card.Text>
            <Card.Text>
              <strong>Key Features:</strong>
              <ul>
                <li>Real-time health monitoring</li>
                <li>Predictive maintenance scheduling</li>
                <li>Interactive dashboard with insights</li>
              </ul>
            </Card.Text>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};

export default LearnMore;
