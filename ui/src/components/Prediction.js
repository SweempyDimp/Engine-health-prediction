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
      const response = await axios.post("http://localhost:8000/predict", features, {
        headers: { "Content-Type": "application/json" },
      });
      const predictionResult = response.data;

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

      localStorage.setItem("lastPrediction", JSON.stringify(predictionResult));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Please try again.");
    }
    setLoading(false);
  };

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
    <div
      style={{
        backgroundImage: `url('${process.env.PUBLIC_URL}/images/image2.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container className="my-5">
        <Card
          className="background-card"
          style={{
            background: `url('${process.env.PUBLIC_URL}/images/image3.jpg') no-repeat center center`,
            backgroundSize: "cover",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Card.Body>
            {/* Replace inner Card with a div using our acrylic wrapper */}
            <div className="acrylic-wrapper">
              <h3 className="text-center mb-4">Engine Health Prediction</h3>
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
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Prediction;
