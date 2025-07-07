// src/components/menu/MenuGrid.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MenuGrid.css';

const MenuGrid = ({ onAddToBill }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5002/api/menu') // Fetch menu items from the backend
      .then((res) => setMenu(res.data))
      .catch((err) => console.error('Error fetching menu:', err));
  }, []);

  return (
    <div className="menu-grid">
      {menu.map((item) => (
        <div key={item.id} className="menu-item">
          <h4>{item.name}</h4>
          <p>₹{item.price}</p>
          <button className="add-button" onClick={() => onAddToBill(item)}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
