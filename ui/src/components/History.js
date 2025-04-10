import React, { useEffect, useState } from "react";
import { Container, Table, Alert } from "react-bootstrap";
import axios from "axios";

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);

  // Detect user's time zone
  // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const preprocessPredictions = (data) => {
    return data.map((pred) => {
      const utcDate = pred.timestamp ? new Date(pred.timestamp) : null;
      if (utcDate) {
        // Convert UTC to IST (UTC+5:30)
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
        const istDate = new Date(utcDate.getTime() + istOffset);
        return { ...pred, createdAt: istDate };
      }
      return { ...pred, createdAt: null };
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("You are not logged in.");
          return;
        }
        const response = await axios.get("http://localhost:8000/predictions/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Debugging
        setPredictions(preprocessPredictions(response.data));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch history.");
      }
    };
    fetchHistory();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Prediction History</h2>
      {error && <Alert variant="danger">{error}</Alert>}
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
          {predictions.map((pred) => (
            <tr key={pred.id}>
              <td>
                {pred.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                  dateStyle: "short",
                  timeStyle: "medium",
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use user's local time zone
                }).format(pred.createdAt)
                : "Invalid Date"}
                </td>
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
    </Container>
  );
};

export default History;