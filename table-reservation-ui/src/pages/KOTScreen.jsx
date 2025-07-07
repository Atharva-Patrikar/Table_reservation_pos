import React, { useState, useEffect } from "react"
import "./KOTScreen.css"

const KOTScreen = () => {
  const [activeTab, setActiveTab] = useState("KOT View")
  const [kots, setKots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5002/api/kots")
      .then((res) => res.json())
      .then((data) => {
        setKots(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="kot-screen" style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Top Tabs */}
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #eee" }}>
        <button
          className={`kot-top-tab${activeTab === "Order View" ? " active" : ""}`}
          onClick={() => setActiveTab("Order View")}
        >
          Order View
        </button>
        <button
          className={`kot-top-tab${activeTab === "KOT View" ? " active" : ""}`}
          onClick={() => setActiveTab("KOT View")}
        >
          KOT View
        </button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16, paddingRight: 24 }}>
          <input
            type="text"
            placeholder="Enter order no."
            style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button
            style={{
              padding: "6px 16px",
              background: "#e53e3e",
              color: "#fff",
              border: "none",
              borderRadius: 4,
            }}
          >
            MFR
          </button>
        </div>
      </div>

      {/* Order View Tabs */}
      {activeTab === "Order View" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 24px",
            borderBottom: "1px solid #eee",
          }}
        >
          <button className="kot-tab active">All</button>
          <button className="kot-tab">Dine In</button>
          <button className="kot-tab">Delivery</button>
          <button className="kot-tab">Pick Up</button>
          <button className="kot-tab">Online</button>
          <button className="kot-tab">Other</button>
          <button className="kot-tab">Home Website</button>
        </div>
      )}

      {/* KOT View Content */}
      {activeTab === "KOT View" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 24px",
            }}
          >
            <input
              type="text"
              placeholder="Search"
              style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc", width: 180 }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: 40 }}>Loading...</div>
          ) : kots.length > 0 ? (
            <div className="kot-grid">
              {kots.map((kot, idx) => (
                <div className="kot-card" key={kot.id || idx}>
                  <div className="kot-card-header">
                    <span className="kot-table-no">
                      Table {kot.kot_no || kot.table_no || kot.tableNo || "-"}
                    </span>
                    <span className="kot-no">KOT No. {kot.kot_no || kot.kotNo || kot.id}</span>
                    <span className="kot-time">{kot.time || "--:--"} MM : SS</span>
                  </div>
                  <div className="kot-card-body">
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty.</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontSize: 13, color: "#888" }}>
                            <span role="img" aria-label="user">👤</span> {kot.biller}
                          </td>
                          <td></td>
                        </tr>
                        {(kot.items || []).map((item, i) => (
                          <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="kot-card-footer">
                    <button className="kot-action-btn">✖</button>
                    <button className="kot-ready-btn">Food Is Ready</button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Default Empty Icon + Message */}
      {!loading && kots.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div style={{ color: "#bbb", fontSize: 22, margin: "32px 0 8px" }}>
            <span role="img" aria-label="no orders" style={{ fontSize: 48 }}>🍽️</span>
          </div>
          <div style={{ color: "#888", fontSize: 16 }}>
            There are no orders available.
          </div>
        </div>
      )}
    </div>
  )
}

export default KOTScreen
