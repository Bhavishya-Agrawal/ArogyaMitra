import React from "react";
import { Phone, Mail, MessageCircle, HeartHandshake } from "lucide-react";

export default function ContactSupport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 mt-20">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center">
            <HeartHandshake className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-blue-700 mt-4">
            Contact Support
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            We’re here to assist you with Ayushman Bharat, hospital support, or medical help.
          </p>
        </div>

        {/* QUICK CONTACT BOXES */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Helpline */}
          <a
            href="tel:14555"
            className="bg-white shadow-lg p-6 rounded-2xl hover:-translate-y-1 transition cursor-pointer text-center border border-blue-100"
          >
            <Phone className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="mt-3 font-bold text-lg">Ayushman Helpline</h3>
            <p className="text-gray-600">14555</p>
          </a>

          {/* Email */}
          <a
            href="mailto:support@pmjay.gov.in"
            className="bg-white shadow-lg p-6 rounded-2xl hover:-translate-y-1 transition cursor-pointer text-center border border-blue-100"
          >
            <Mail className="w-10 h-10 text-blue-600 mx-auto" />
            <h3 className="mt-3 font-bold text-lg">Email Support</h3>
            <p className="text-gray-600">support@pmjay.gov.in</p>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="bg-white shadow-lg p-6 rounded-2xl hover:-translate-y-1 transition cursor-pointer text-center border border-blue-100"
          >
            <MessageCircle className="w-10 h-10 text-green-600 mx-auto" />
            <h3 className="mt-3 font-bold text-lg">WhatsApp Support</h3>
            <p className="text-gray-600">Chat with us</p>
          </a>
        </div>

        {/* FORM SECTION */}
        <div className="bg-white shadow-xl p-10 rounded-3xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Send Us a Message
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // stub: submit logic here
              alert("Message sent (stub). Integrate API to actually send.");
            }}
            className="grid grid-cols-1 gap-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-blue-400"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-blue-400"
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-blue-400"
              />

              <select
                name="category"
                className="p-4 border rounded-xl bg-gray-50 outline-none focus:border-blue-400"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select Help Category
                </option>
                <option value="ayushman">Ayushman Card</option>
                <option value="hospital">Hospital Admission</option>
                <option value="billing">Medical Bill Doubt</option>
                <option value="other">Others</option>
              </select>
            </div>

            <textarea
              name="message"
              placeholder="Your Message..."
              className="w-full p-4 border rounded-xl bg-gray-50 mt-2 outline-none focus:border-blue-400"
              rows="5"
              required
            ></textarea>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="mt-2 inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
              >
                Send Message
              </button>

              <a
                href="tel:14555"
                className="mt-2 inline-block px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700"
              >
                Call Helpline
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block px-5 py-3 bg-green-600 text-white rounded-xl"
              >
                WhatsApp
              </a>
            </div>
          </form>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-gray-500 mt-10">
          We respond within 24 hours • PM-JAY Support Team
        </p>
      </div>
    </div>
  );
}
