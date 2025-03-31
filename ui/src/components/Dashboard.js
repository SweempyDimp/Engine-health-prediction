// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { Container, Card, Alert } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const storedPrediction = localStorage.getItem("lastPrediction");
    if (storedPrediction) {
      setPrediction(JSON.parse(storedPrediction));
    }
  }, []);

  const pieChartData = prediction
    ? {
        labels: ["Working properly", "At risk"],
        datasets: [
          {
            data: prediction.prediction_proba,
            backgroundColor: ["#4caf50", "#f44336"],
          },
        ],
      }
    : null;

  return (
    <Container className="my-5 dashboard-container">
      <h2 className="text-center mb-4">Current Prediction</h2>
      {prediction ? (
        <Card className="shadow-lg acrylic-card">
          <Card.Body>
            <Alert variant={prediction.risk_status.includes("At risk") ? "danger" : "success"}>
              <strong>Prediction:</strong> {prediction.risk_status} <br />
              <strong>Probabilities:</strong> {JSON.stringify(prediction.prediction_proba)}
            </Alert>
            {pieChartData && (
              <div style={{ maxWidth: "300px", margin: "20px auto", height: "300px" }}>
                <Pie
                  data={pieChartData}
                  options={{
                    plugins: { legend: { position: "bottom" } },
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info" className="text-center">
          No current prediction found. Please make a prediction.
        </Alert>
      )}
    </Container>
  );
};

export default Dashboard;
