"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone } from "react-feather";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabList, Tab } from "./ui/tabs";
import ScrollArea from "./ui/scroll-area"; // Default import

const ReservationPanel = () => {
  const [reservations, setReservations] = useState([]); // State to store reservations
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch reservations from the backend
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/reservations");
        if (response.ok) {
          const data = await response.json();
          setReservations(data.reservations || []); // Update state with fetched reservations
        } else {
          console.error("Failed to fetch reservations");
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false); // Stop loading once the fetch is complete
      }
    };

    fetchReservations();
  }, []); // Runs only once when the component is mounted

  return (
    <div className="reservation-panel">
      <div className="reservation-panel-header">
        <h2>Reservations</h2>
        <div className="reservation-tabs">
          <Tabs defaultValue="reservations">
            <TabList>
              <Tab value="reservations">Reservations</Tab>
              <Tab value="waitlist">Waitlist</Tab>
              <Tab value="qr-menu">QR Menu</Tab>
            </TabList>
          </Tabs>
        </div>
      </div>

      <div className="reservation-search">
        <Input placeholder="Search reservations..." className="reservation-search-input" />
        <div className="date-selector">
          <Button variant="outline" className="date-btn">
            <Calendar size={16} />
            <span>Today</span>
          </Button>
          <Button variant="outline" className="date-btn">
            <Calendar size={16} />
            <span>Tomorrow</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="reservations-list" maxHeight="calc(100vh - 250px)">
        {loading ? (
          <p>Loading reservations...</p>
        ) : reservations.length > 0 ? (
          reservations.map((reservation) => (
            <Card key={reservation.id} className="reservation-card">
              <div className="reservation-card-header">
                <div className="reservation-name">
                  <h3>{reservation.customer_name}</h3>
                  <span className={`reservation-status ${reservation.status}`}>{reservation.status}</span>
                </div>
                <div className="reservation-phone">
                  <Phone size={14} />
                  <span>{reservation.customer_phone || "N/A"}</span>
                </div>
              </div>

              <div className="reservation-details">
                <div className="reservation-date">
                  <Calendar size={14} />
                  <span>{new Date(reservation.date_time).toLocaleDateString()}</span>
                </div>
                <div className="reservation-time">
                  <Clock size={14} />
                  <span>{new Date(reservation.date_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div className="reservation-guests">
                  <User size={14} />
                  <span>{reservation.number_of_guests}</span>
                </div>
              </div>

              <div className="reservation-actions">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="primary" size="sm">
                  Check In
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No reservations available.</p>
        )}
      </ScrollArea>

      <div className="reservation-panel-footer">
        <Button variant="primary" className="new-reservation-btn">
          New Reservation
        </Button>
      </div>
    </div>
  );
};

export default ReservationPanel;
