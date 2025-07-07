"use client"

import {
  FaBars,
  FaBell,
  FaClock,
  FaPhone,
  FaPlusCircle,
  FaFileInvoice,
  FaCashRegister,
  FaUtensils,
  FaReceipt,
  FaChartBar,
  FaUser,
  FaPowerOff,
} from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate()

  const handleKotClick = () => {
    navigate("/kot")
  }

  const handleNewOrder = () => {
    navigate("/", { replace: true })
  }

  return (
    <nav className="bg-white text-black p-4 border-b border-gray-200 shadow-sm w-full">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-black text-2xl md:hidden">
            <FaBars />
          </button>

          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            Restaurant
          </div>

          <button
            onClick={handleNewOrder}
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 text-sm shadow-md transition-all duration-200"
          >
            <FaPlusCircle className="text-base" />
            <span>New Order</span>
          </button>

          <input
            type="text"
            className="px-3 py-1.5 rounded-md bg-gray-50 text-gray-700 placeholder-gray-400 text-sm border border-gray-200 w-24"
            placeholder="Bill No"
            disabled
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Support Box (black base, red on hover) */}
          <div
            className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-red-50 group transition-all duration-200"
            title="Support"
          >
            <FaPhone className="text-black group-hover:text-red-600 text-base" />
            <span className="text-sm font-medium text-black group-hover:text-red-600 whitespace-nowrap">
              Call for Support: ---
            </span>
          </div>

          {/* Icons (black base, red on hover) */}
          <div className="flex items-center space-x-4">
            <FaFileInvoice
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="Billing"
            />
            <FaCashRegister
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="POS"
            />
            <FaUtensils
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="Menu"
            />
            <FaReceipt
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              onClick={handleKotClick}
              title="KOT"
            />
            <FaChartBar
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="Reports"
            />
            <FaClock
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="Timer"
            />
            <FaBell
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="Notifications"
            />
            <FaUser
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="User"
            />
            <FaPowerOff
              className="text-xl text-black hover:text-red-600 cursor-pointer transition-colors"
              title="Logout"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
