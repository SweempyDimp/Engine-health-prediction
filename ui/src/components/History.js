// src/components/History.js
import React, { useEffect, useState } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import axios from "axios";

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/predictions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPredictions(res.data.predictions || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch prediction history.");
      }
    };
    fetchHistory();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Prediction History</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {predictions.length === 0 ? (
        <Alert variant="info" className="text-center">
          No prediction history found.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Engine RPM</th>
              <th>Lube Oil Pressure</th>
              <th>Fuel Pressure</th>
              <th>Coolant Pressure</th>
              <th>Lube Oil Temp</th>
              <th>Coolant Temp</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((pred) => (
              <tr key={pred.id}>
                <td>{new Date(pred.timestamp).toLocaleString()}</td>
                <td>{pred.engine_rpm}</td>
                <td>{pred.lub_oil_pressure}</td>
                <td>{pred.fuel_pressure}</td>
                <td>{pred.coolant_pressure}</td>
                <td>{pred.lub_oil_temp}</td>
                <td>{pred.coolant_temp}</td>
                <td>{pred.result}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default History;
