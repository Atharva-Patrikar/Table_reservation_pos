"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock, Filter, Plus, Search, Users } from "lucide-react";
import { getReservations } from "@/lib/api";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getReservations();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 p-6 flex items-center justify-center">Loading reservations...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Reservations & Dine-In Management</h1>
            <Link href="/reservations/create">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" /> New Reservation
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="checked-in">Checked In</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search reservations..." className="pl-8 w-[200px]" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {["upcoming", "checked-in", "completed", "cancelled"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reservations
                    .filter((res) => {
                      if (tab === "upcoming") return res.status === "pending" || res.status === "booked";
                      return res.status === tab;
                    })
                    .map((reservation) => (
                      <Card key={reservation.res_id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-lg">{reservation.customer_name}</h3>
                              <p className="text-sm text-gray-500">{reservation.customer_phone}</p>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                reservation.status
                              )}`}
                            >
                              {reservation.status}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Date</span>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3" />
                                <span className="text-sm font-medium">
                                  {new Date(reservation.date_time).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Time</span>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                <span className="text-sm font-medium">
                                  {new Date(reservation.date_time).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Table</span>
                              <div className="flex items-center">
                                <Users className="mr-1 h-3 w-3" />
                                <span className="text-sm font-medium">Table {reservation.table_id}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-2">
                            <Link href={`/reservations/${reservation.res_id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                View
                              </Button>
                            </Link>
                            {tab === "upcoming" && (
                              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                                Check In
                              </Button>
                            )}
                            {tab === "checked-in" && (
                              <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">
                                Generate Bill
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </main>
  );
}