import axios from "axios";

// Use the same API URL as your existing code
const API_URL = "http://localhost:5002/api/reservations";

// Reservation API functions
export const getReservations = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

export const getReservation = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservation ${id}:`, error);
    throw error;
  }
};

export const createReservation = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

export const updateReservation = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation ${id}:`, error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reservation ${id}:`, error);
    throw error;
  }
};

// Mock functions for tables and waitlist (since they're not in your original API)
// In a real implementation, you would create these endpoints on your backend
export const getTables = async () => {
  // This is a mock function - replace with actual API call when available
  return [
    { table_id: 1, name: "Table 1", capacity: 4, status: "available" },
    { table_id: 2, name: "Table 2", capacity: 2, status: "occupied", occupiedSince: "12:30 PM" },
    { table_id: 3, name: "Table 3", capacity: 6, status: "reserved", reservedFor: "7:00 PM" },
    { table_id: 4, name: "Table 4", capacity: 4, status: "available" },
    { table_id: 5, name: "Table 5", capacity: 8, status: "occupied", occupiedSince: "1:15 PM" },
    { table_id: 6, name: "Table 6", capacity: 2, status: "available" },
    { table_id: 7, name: "Table 7", capacity: 4, status: "reserved", reservedFor: "8:30 PM" },
    { table_id: 8, name: "Table 8", capacity: 6, status: "available" },
    { table_id: 9, name: "Table 9", capacity: 4, status: "occupied", occupiedSince: "2:45 PM" },
    { table_id: 10, name: "Table 10", capacity: 2, status: "available" },
    { table_id: 11, name: "Table 11", capacity: 8, status: "reserved", reservedFor: "7:30 PM" },
    { table_id: 12, name: "Table 12", capacity: 4, status: "available" },
  ];
};

export const getWaitlist = async () => {
  // This is a mock function - replace with actual API call when available
  return [
    {
      id: 1,
      customer_name: "Robert Chen",
      customer_phone: "9876543210",
      guests: 2,
      waitingSince: "6:30 PM",
      estimatedTime: "15 min",
      status: "waiting",
    },
    {
      id: 2,
      customer_name: "Emily Davis",
      customer_phone: "8765432109",
      guests: 4,
      waitingSince: "6:45 PM",
      estimatedTime: "25 min",
      status: "waiting",
    },
    {
      id: 3,
      customer_name: "Thomas Wilson",
      customer_phone: "7654321098",
      guests: 3,
      waitingSince: "7:00 PM",
      estimatedTime: "35 min",
      status: "waiting",
    },
    {
      id: 4,
      customer_name: "Lisa Johnson",
      customer_phone: "6543210987",
      guests: 2,
      waitingSince: "7:15 PM",
      estimatedTime: "45 min",
      status: "notified",
    },
    {
      id: 5,
      customer_name: "Michael Brown",
      customer_phone: "5432109876",
      guests: 6,
      waitingSince: "7:30 PM",
      estimatedTime: "55 min",
      status: "waiting",
    },
  ];
};