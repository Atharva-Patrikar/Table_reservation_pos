import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const fetchTables = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/tables");
      const now = new Date();

      const updatedTables = res.data.map((table) => {
        let kotMinutes = 0;
        if (table.kot_start_time) {
          const start = new Date(table.kot_start_time);
          kotMinutes = Math.floor((now - start) / 60000);
        }
        return { ...table, kotMinutes };
      });

      setTables(updatedTables);
    } catch (err) {
      console.error("Error fetching tables:", err);
    }
  };

  fetchTables();
  const interval = setInterval(fetchTables, 60000); // refresh every 60s
  return () => clearInterval(interval);
}, []);



  const handleTableClick = (tableId) => {
    // Navigate to ItemsPage and pass the tableId as a query param
    navigate(`/items?tableId=${tableId}`);
  };
  

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "status-available";
      case "occupied":
        return "status-occupied";
      case "kot":
        return "status-kot";
      case "reserved":
        return "status-reserved";
      default:
        return "";
    }
  };

  return (
    <div className="home-page">

      {/* Table View Title Section */}
      <div className="table-view-title">
        <h2>Table View</h2>
        <div className="title-actions">
          <button className="action-btn">Delivery</button>
          <button className="action-btn">Pick Up</button>
          <button className="action-btn">+ Add Table</button>
        </div>
      </div>

      {/* Filter/Legend Section */}
      <div className="filter-legend">
        <div className="filter-left flex gap-4">
          <button className="action-btn">+ Table Reservation</button>
          <button className="action-btn">+ Contactless</button>
          
        </div>
        <div className="filter-right">
          <div className="legends">
            <button className="action-btn">Move KOT / Items</button>
            <span className="legend blank">Blank Table</span>
            <span className="legend running">Running Table</span>
            <span className="legend printed">Printed Table</span>
            <span className="legend paid">Paid Table</span>
            <span className="legend kot">Running KOT Table</span>
          </div>
        </div>
      </div>

      {/* Table Grid Section */}
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table.table_id}
            className={`table-card ${getStatusClass(table.table_status)}`}
            onClick={() => handleTableClick(table.table_id)}
            style={
              table.table_status?.toLowerCase() === "kot"
                ? { background: "#fffbe6", border: "1px solid #ffe58f", color: "#222" }
                : {}
            }
          >
            {table.table_status?.toLowerCase() === "kot" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 8 }}>
                <div style={{ color: "#888", fontSize: 14, marginBottom: 2 }}>
                  {table.kotMinutes} Min
                </div>

                <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 2 }}>
                  {table.table_id}
                </div>
                <div style={{ color: "#333", fontSize: 16, marginBottom: 6 }}>
                  ₹{table.kot_amount ? Number(table.kot_amount).toFixed(2) : "0.00"}
                </div>
                <button style={{ border: "none", background: "none", cursor: "pointer" }}>
                  <span role="img" aria-label="view" style={{ fontSize: 22 }}>👁️</span>
                </button>
              </div>
            ) : (
              <>
                <h3>{table.table_name}</h3>
                <p>Status: {table.table_status}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;