"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button} from "./ui/button"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import { Label } from "./ui/label"
import "./ReservationForm.css"

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    table: "",
    specialRequests: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  const timeOptions = [
    { value: "11:00", label: "11:00 AM" },
    { value: "11:30", label: "11:30 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "12:30", label: "12:30 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "13:30", label: "1:30 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "18:00", label: "6:00 PM" },
    { value: "18:30", label: "6:30 PM" },
    { value: "19:00", label: "7:00 PM" },
    { value: "19:30", label: "7:30 PM" },
    { value: "20:00", label: "8:00 PM" },
    { value: "20:30", label: "8:30 PM" },
    { value: "21:00", label: "9:00 PM" },
  ]

  const guestOptions = [
    { value: "1", label: "1 Person" },
    { value: "2", label: "2 People" },
    { value: "3", label: "3 People" },
    { value: "4", label: "4 People" },
    { value: "5", label: "5 People" },
    { value: "6", label: "6 People" },
    { value: "7", label: "7 People" },
    { value: "8", label: "8 People" },
    { value: "9", label: "9 People" },
    { value: "10", label: "10 People" },
    { value: "more", label: "More than 10" },
  ]

  const tableOptions = [
    { value: "1", label: "Table 1 (4 seats)" },
    { value: "2", label: "Table 2 (2 seats)" },
    { value: "3", label: "Table 3 (6 seats)" },
    { value: "4", label: "Table 4 (4 seats)" },
    { value: "6", label: "Table 6 (2 seats)" },
    { value: "8", label: "Table 8 (6 seats)" },
    { value: "10", label: "Table 10 (2 seats)" },
    { value: "12", label: "Table 12 (4 seats)" },
  ]

  return (
    <div className="reservation-form-container">
      <div className="reservation-form-header">
        <h2>New Reservation</h2>
      </div>

      <Card className="reservation-form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Guest Information</h3>
            <Input
              label="Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter guest name"
              required
            />

            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />

            <Input
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-section">
            <h3>Reservation Details</h3>
            <Input
              label="Date"
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <Select
              label="Time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              options={timeOptions}
              required
            />

            <Select
              label="Number of Guests"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              options={guestOptions}
              required
            />

            <Select
              label="Table"
              id="table"
              name="table"
              value={formData.table}
              onChange={handleChange}
              options={tableOptions}
            />
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-group">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter any special requests or notes"
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Reservation
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ReservationForm

