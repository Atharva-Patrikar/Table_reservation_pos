"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSave,
  FaPrint,
  FaFileInvoice,
  FaPause,
} from "react-icons/fa";
import generateBillPdf from "../../utils/generateBillPdf";

const ActionButtons = ({
  cart,
  grandTotal,
  paymentMethod,
  setPdfUrl,
  pdfUrl,
  tableNumber,
  peopleCount,
  customerDetails,
  orderType,
  kotItems = [],
  newKotItems = [],
  setKotItems,
  setNewKotItems,
  setCart,
}) => {
  const [isPrinted, setIsPrinted] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState("");
  const navigate = useNavigate();

  const TAX_RATE = 0.05;

  const clearCart = () => {
    if (tableNumber) {
      localStorage.removeItem(`cart-table-${tableNumber}`);
      if (setCart) setCart([]);
    }
  };

  const saveOrder = async () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * TAX_RATE;
    const discount = subtotal + tax - grandTotal;

    const response = await fetch("http://localhost:5002/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_type: orderType,
        table_info: tableNumber,
        people_count: peopleCount,
        customer: customerDetails,
        payment_type: paymentMethod,
        subtotal,
        tax,
        discount,
        grand_total: grandTotal,
        items: cart,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  };

  const handleSaveAndPrint = async () => {
    try {
      const result = await saveOrder();
      if (result.success) {
        alert("Order saved. Printing...");
        generateBillPdf(cart, grandTotal, paymentMethod, orderType, setPdfUrl);
        clearCart();

        setTimeout(() => {
          if (pdfUrl) {
            const iframe = document.createElement("iframe");
            iframe.src = pdfUrl;
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
          }
          setIsPrinted(true);
        }, 500);
      } else {
        alert("Failed to save order.");
      }
    } catch (err) {
      console.error("Error saving and printing:", err);
      alert("Something went wrong.");
    }
  };

  const handleSaveOnly = async () => {
    try {
      const result = await saveOrder();
      if (result.success) {
        alert("Order saved successfully.");
        clearCart();
      } else {
        alert("Failed to save order.");
      }
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Something went wrong while saving the order.");
    }
  };

  const handleSettlement = () => {
    if (!settlementAmount || isNaN(settlementAmount)) {
      alert("Please enter a valid amount.");
      return;
    }
    alert(`Settled ₹${settlementAmount} and order marked complete.`);
  };

  const handleKOT = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/kots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_no: tableNumber,
          items: newKotItems.length > 0 ? newKotItems : cart,
          amount: grandTotal,
          kot_time: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("KOT creation failed:", errorText);
        throw new Error("Failed to save KOT");
      }

      if (setKotItems && setNewKotItems) {
        setKotItems((prev) => [...prev, ...newKotItems]);
        setNewKotItems([]);
      }

      clearCart();
      navigate("/");
    } catch (err) {
      alert("Failed to create KOT");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col space-y-2 text-xs">
      {isPrinted && (
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Enter Settlement Amount"
            value={settlementAmount}
            onChange={(e) => setSettlementAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
          <button
            onClick={handleSettlement}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Settle & Save
          </button>
        </div>
      )}

      <div className="flex justify-between items-center space-x-2">
        <button
          onClick={handleSaveOnly}
          className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1"
        >
          <FaSave className="mr-1" /> Save
        </button>

        <button
          onClick={handleSaveAndPrint}
          className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1"
        >
          <FaPrint className="mr-1" /> Save & Print
        </button>

        <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1">
          <FaFileInvoice className="mr-1" /> eBill
        </button>

        <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex-1">
          <FaPause className="mr-1" /> Hold
        </button>
      </div>

      <div className="flex justify-between items-center space-x-2 pt-2">
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 flex-1"
          onClick={handleKOT}
        >
          KOT
        </button>
        <button className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 flex-1">
          KOT & Print
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
