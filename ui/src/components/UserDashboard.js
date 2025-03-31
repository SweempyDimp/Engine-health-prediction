// src/components/UserDashboard.js
import React, { useState, useEffect } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import axios from "axios";

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("User not authenticated.");
      return;
    }
    axios
      .get("http://localhost:8000/predictions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Assuming your backend returns an object with a 'predictions' array
        setHistory(res.data.predictions || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load prediction history.");
      });
  }, []);

  return (
    <Container className="my-5">
      <h2>Your Prediction History</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {history.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
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
            {history.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>{item.engine_rpm}</td>
                <td>{item.lub_oil_pressure}</td>
                <td>{item.fuel_pressure}</td>
                <td>{item.coolant_pressure}</td>
                <td>{item.lub_oil_temp}</td>
                <td>{item.coolant_temp}</td>
                <td>{item.result}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        !error && <p>No prediction history found.</p>
      )}
    </Container>
  );
};

export default UserDashboard;
