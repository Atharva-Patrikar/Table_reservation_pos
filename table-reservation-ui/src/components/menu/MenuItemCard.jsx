// components/menu/MenuItemCard.jsx
import React from "react";

const MenuItemCard = ({ item, onAddToBill }) => {
  return (
    <div className="menu-item-card border p-4 rounded shadow hover:shadow-lg transition-all">
      <h4 className="text-lg font-medium mb-2">{item.name}</h4>
      <p className="text-sm text-gray-600 mb-1">Price: ₹{item.price}</p>
      {item.shortcut && (
        <p className="text-xs text-gray-400 mb-2">Shortcut: {item.shortcut}</p>
      )}
      <button
        className="btn-primary w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-all"
        onClick={() => onAddToBill(item)}
      >
        Add to Bill
      </button>
    </div>
  );
};

export default MenuItemCard;
