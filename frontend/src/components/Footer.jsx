import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
        <footer className="bg-gray-950 text-gray-300 py-16 mt-20 w-full">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 px-8">

          <div>
            <h3 className="font-semibold text-2xl text-white">Arogya Mitra</h3>
            <p className="mt-4 text-sm">
              Your trusted AI health assistant for PM–JAY & Ayushman Bharat.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="mt-4 text-sm space-y-2">
              <li><Link to="/hospitals">Hospitals</Link></li>
              <li><Link to="/scan">Bill Scanner</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Support</h4>
            <ul className="mt-4 text-sm space-y-2">
              <li>Ayushman Helpline: <span className="font-semibold">14555</span></li>
              <li>Official Site: pmjay.gov.in</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Follow Us</h4>
            <p className="text-sm mt-4">Social channels launching soon.</p>
          </div>

        </div>

        <div className="mt-12 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Arogya Mitra. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}

export default Footer