import React from 'react';
import contactImage from '../../src/assets/contact.png';
import Header from './header/MainHeader';
import Footer from './footer/Footer';

export default function ContactSupportPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-100 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full bg-white shadow-2xl rounded-[2rem] p-10 grid md:grid-cols-2 gap-10 transform transition-all duration-500 hover:scale-[1.01]">
          <div className="flex items-center justify-center">
            <img
              src={contactImage}
              alt="Support Agent"
              className="w-full max-w-md object-cover rounded-2xl border border-gray-200 shadow-lg"
            />
          </div>

          <div>
            <h2 className="text-4xl font-extrabold text-blue-700 mb-4 drop-shadow-md">Contact Support</h2>
            <p className="text-gray-600 mb-8">
              Have questions or need help? Our team is here for you.
            </p>
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05),_4px_4px_15px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05),_4px_4px_15px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05),_4px_4px_15px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-3 px-6 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105"
              >
                ✉️ Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
