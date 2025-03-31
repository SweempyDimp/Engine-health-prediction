// src/components/Prediction.js
import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Prediction.css";

const Prediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    engineRpm: "",
    lubOilPressure: "",
    fuelPressure: "",
    coolantPressure: "",
    lubOilTemp: "",
    coolantTemp: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // When Predict is clicked, send data to /predict, then call /predictions/create to save it,
  // and finally redirect to the Dashboard page.
  const handlePredict = async (e) => {
    e.preventDefault();
    const features = [
      parseFloat(formData.engineRpm),
      parseFloat(formData.lubOilPressure),
      parseFloat(formData.fuelPressure),
      parseFloat(formData.coolantPressure),
      parseFloat(formData.lubOilTemp),
      parseFloat(formData.coolantTemp),
    ];

    if (features.some(isNaN)) {
      setError("Please enter valid numeric values for all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, get the prediction result from the ML model.
      const response = await axios.post("http://localhost:8000/predict", features, {
        headers: { "Content-Type": "application/json" },
      });
      const predictionResult = response.data;

      // Then, save the prediction to MongoDB.
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You must be logged in to save predictions.");
        setLoading(false);
        return;
      }
      const predictionData = {
        engine_rpm: parseFloat(formData.engineRpm),
        lub_oil_pressure: parseFloat(formData.lubOilPressure),
        fuel_pressure: parseFloat(formData.fuelPressure),
        coolant_pressure: parseFloat(formData.coolantPressure),
        lub_oil_temp: parseFloat(formData.lubOilTemp),
        coolant_temp: parseFloat(formData.coolantTemp),
        result: predictionResult.risk_status,
      };
      await axios.post("http://localhost:8000/predictions/create", predictionData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Optionally, save the prediction result to localStorage for the Dashboard's current prediction view.
      localStorage.setItem("lastPrediction", JSON.stringify(predictionResult));

      // Redirect to Dashboard (which shows the current prediction).
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Please try again.");
    }
    setLoading(false);
  };

  // Reset function to clear the form inputs.
  const handleReset = () => {
    setFormData({
      engineRpm: "",
      lubOilPressure: "",
      fuelPressure: "",
      coolantPressure: "",
      lubOilTemp: "",
      coolantTemp: "",
    });
    setError("");
  };

  return (
    <Container className="my-5">
      <Card className="background-card">
        <Card.Body>
          <Card className="acrylic-card">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                Engine Health Prediction
              </Card.Title>
              <p className="text-center">
                Enter your engine parameters below to predict its health status.
              </p>
              <Form onSubmit={handlePredict}>
                <Form.Group className="mb-3" controlId="engineRpm">
                  <Form.Label>Engine RPM</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Engine RPM"
                    name="engineRpm"
                    value={formData.engineRpm}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lubOilPressure">
                  <Form.Label>Lube Oil Pressure</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Lube Oil Pressure"
                    name="lubOilPressure"
                    value={formData.lubOilPressure}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="fuelPressure">
                  <Form.Label>Fuel Pressure</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Fuel Pressure"
                    name="fuelPressure"
                    value={formData.fuelPressure}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="coolantPressure">
                  <Form.Label>Coolant Pressure</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Coolant Pressure"
                    name="coolantPressure"
                    value={formData.coolantPressure}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lubOilTemp">
                  <Form.Label>Lube Oil Temperature</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Lube Oil Temperature"
                    name="lubOilTemp"
                    value={formData.lubOilTemp}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="coolantTemp">
                  <Form.Label>Coolant Temperature</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Coolant Temperature"
                    name="coolantTemp"
                    value={formData.coolantTemp}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="d-flex justify-content-around">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Predicting..." : "Predict"}
                  </Button>
                  <Button variant="secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </Form>
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Prediction;
