import { Clock, User, Phone } from "react-feather"
import {Card} from "./ui/card"
import {Button} from "./ui/button"
import "./WaitlistLoading.css"

const WaitlistLoading = () => {
  const waitlistEntries = [
    {
      id: 1,
      name: "Sharma Family",
      phone: "9876543210",
      guests: 4,
      waitingSince: "30 mins",
      estimatedTime: "15 mins",
    },
    {
      id: 2,
      name: "Patel Group",
      phone: "9876543211",
      guests: 6,
      waitingSince: "45 mins",
      estimatedTime: "20 mins",
    },
    {
      id: 3,
      name: "Kumar Couple",
      phone: "9876543212",
      guests: 2,
      waitingSince: "15 mins",
      estimatedTime: "10 mins",
    },
  ]

  return (
    <div className="waitlist-loading">
      <div className="waitlist-header">
        <h2>Waitlist</h2>
        <div className="waitlist-stats">
          <div className="stat">
            <span className="stat-value">3</span>
            <span className="stat-label">Parties Waiting</span>
          </div>
          <div className="stat">
            <span className="stat-value">12</span>
            <span className="stat-label">Total Guests</span>
          </div>
          <div className="stat">
            <span className="stat-value">30 min</span>
            <span className="stat-label">Avg. Wait Time</span>
          </div>
        </div>
      </div>

      <div className="waitlist-entries">
        {waitlistEntries.map((entry) => (
          <Card key={entry.id} className="waitlist-card">
            <div className="waitlist-card-header">
              <h3>{entry.name}</h3>
              <div className="waitlist-phone">
                <Phone size={14} />
                <span>{entry.phone}</span>
              </div>
            </div>

            <div className="waitlist-details">
              <div className="waitlist-guests">
                <User size={14} />
                <span>{entry.guests} guests</span>
              </div>
              <div className="waitlist-time">
                <Clock size={14} />
                <span>Waiting: {entry.waitingSince}</span>
              </div>
              <div className="waitlist-estimate">
                <Clock size={14} />
                <span>ETA: {entry.estimatedTime}</span>
              </div>
            </div>

            <div className="waitlist-actions">
              <Button variant="outline" size="sm">
                Text
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="primary" size="sm">
                Seat Now
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="waitlist-footer">
        <Button variant="primary" className="add-to-waitlist-btn">
          Add to Waitlist
        </Button>
      </div>
    </div>
  )
}

export default WaitlistLoading

