"use client";

import { useState, useEffect } from "react";
import { Search } from "react-feather";
import { Input } from "./ui/input";
import "./ReservationList.css";

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState([]);

  // Fetch reservations from the backend
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/reservations");
        if (response.ok) {
          const data = await response.json();
          // Filter only "reserved" or "booked" reservations
          const filteredReservations = data.reservations.filter(
            (reservation) =>
              reservation.status === "confirmed" || reservation.status === "booked"
          );
          setReservations(filteredReservations);
        } else {
          console.error("Failed to fetch reservations");
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  // Filter reservations based on the search term
  const filteredReservations = reservations.filter((reservation) =>
    (reservation.customer_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reservation-list">
      <div className="reservation-list-header">
        <h2>Reservations</h2>
      </div>

      <div className="reservation-filters">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <Input
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="reservations-table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Table ID</th>
              <th>Phone</th>
              <th>Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.customer_name || "Unknown"}</td>
                  <td>{reservation.table_id || "N/A"}</td>
                  <td>{reservation.customer_phone || "N/A"}</td>
                  <td>
                    {reservation.date_time
                      ? new Date(reservation.date_time).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{reservation.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="no-results" colSpan="6">
                  No reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList;

