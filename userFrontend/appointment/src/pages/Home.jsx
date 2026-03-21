import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6">Healthcare at Your Fingertips</h1>
          <p className="text-2xl text-blue-50 mb-10 leading-relaxed">
            Book appointments with certified doctors, manage your health, and receive quality care
          </p>
          
          {user ? (
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/doctors')}
                className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-blue-50 text-lg transition shadow-lg"
              >
                🩺 Browse Doctors
              </button>
              <button
                onClick={() => navigate('/appointments')}
                className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-500 text-lg transition"
              >
                📅 My Appointments
              </button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-blue-50 text-lg transition shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-500 text-lg transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition">
            <div className="text-5xl mb-6">🏥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Find Top Doctors</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Access a network of qualified healthcare professionals across various specializations
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition">
            <div className="text-5xl mb-6">⏱️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Booking</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Schedule appointments instantly at times that work best for your schedule
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition">
            <div className="text-5xl mb-6">⭐</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted Reviews</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Read real patient feedback and ratings to make informed healthcare decisions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-xl text-blue-100">Certified Doctors</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <p className="text-xl text-blue-100">Happy Patients</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <p className="text-xl text-blue-100">Customer Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-8 text-center hover:shadow-lg transition">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Register</h4>
            <p className="text-gray-600">Create your account with your details</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-8 text-center hover:shadow-lg transition">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Browse</h4>
            <p className="text-gray-600">Search and filter doctors by specialization</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-8 text-center hover:shadow-lg transition">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Book</h4>
            <p className="text-gray-600">Select a date and time for your appointment</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-8 text-center hover:shadow-lg transition">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">4</div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Feedback</h4>
            <p className="text-gray-600">Rate your experience and help others</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
