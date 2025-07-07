import { useState, useEffect } from "react";
import { User } from "react-feather";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import "./table-view.css";

const TableView = ({ reservations = [] }) => {
  const [tables, setTables] = useState([]); // State for table list
  const [selectedTable, setSelectedTable] = useState(null); // State for selected table details
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Fetch tables from API
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/tables"); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setTables(data.tables || []);
        } else {
          console.error("Failed to fetch tables");
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = async (tableId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/tables/${tableId}`); // Fetch table details
      if (response.ok) {
        const data = await response.json();
        setSelectedTable(data); // Set the selected table details
        setShowModal(true); // Show the modal
      } else {
        console.error("Failed to fetch table details");
      }
    } catch (error) {
      console.error("Error fetching table details:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "status-available";
      case "occupied":
        return "status-occupied";
      case "reserved":
        return "status-reserved";
      default:
        return "";
    }
  };

  return (
    <div className="table-view">
      <div className="table-view-header">
        <h2>Tables</h2>
      </div>

      <div className="tables-grid">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`table-card ${getStatusClass(table.status)}`}
            onClick={() => handleTableClick(table.id)} // Fetch details on click
          >
            <div className="table-card-header">
              <h3>Table {table.number}</h3>
              <div className="table-capacity">
                <User size={14} />
                <span>{table.capacity}</span>
              </div>
            </div>
            <div className="table-status">
              <span>{table.status}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Table Details */}
      {showModal && selectedTable && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="text-xl font-bold mb-4">{selectedTable.name}</h2>
            <p>Status: {selectedTable.status}</p>
            <h3 className="text-lg font-bold mt-4">Orders</h3>
            <table className="order-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedTable.orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.item}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.price}</td>
                    <td>₹{order.quantity * order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-lg font-bold mt-4">
              Total Amount: ₹
              {selectedTable.orders.reduce(
                (total, order) => total + order.quantity * order.price,
                0
              )}
            </h3>
            <div className="modal-actions mt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;