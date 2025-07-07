"use client";

import React from "react";
import { Navbar } from "../components/navbar";
import { Sidebar } from "../components/sidebar";
import ReservationForm from "../components/ReservationForm";

export default function CreateReservationPage() {
  return (
    <main className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Create a New Reservation</h1>
          <ReservationForm />
        </div>
      </div>
    </main>
  );
}