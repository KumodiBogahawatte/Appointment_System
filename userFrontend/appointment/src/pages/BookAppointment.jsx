import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const doctorId = location.state?.doctorId;

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      setDoctor(response.data);
    } catch (err) {
      setError('Failed to load doctor details');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Combine date and time
      const appointmentDate = new Date(`${formData.date}T${formData.time}`);
      
      if (appointmentDate < new Date()) {
        setError('Cannot book appointment for past date/time');
        setLoading(false);
        return;
      }

      const response = await api.post('/appointments', {
        userId: user.id,
        doctorId: doctorId,
        date: appointmentDate.toISOString(),
        notes: formData.notes
      });

      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="animate-spin text-4xl">⏳</div>
          Loading doctor details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Book an Appointment</h1>
          <p className="text-xl text-gray-600">Schedule a consultation with our healthcare professional</p>
        </div>

        {/* Doctor Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl">👨‍⚕️</div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{doctor.name}</h2>
              <p className="text-blue-100 text-xl mb-3">{doctor.specialization}</p>
              {doctor.contact && (
                <p className="text-blue-50 flex items-center gap-2 text-lg">
                  <span>📞</span> {doctor.contact}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg mb-6">
            <p className="font-semibold text-lg">❌ {error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-5 rounded-lg mb-6">
            <p className="font-semibold text-lg">✅ {success}</p>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800">📅 Appointment Details</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Date Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                📆 Select Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
              />
            </div>

            {/* Time Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                🕒 Preferred Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
              />
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-lg">
                💬 Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg resize-none"
                placeholder="Share any medical history, allergies, or concerns with the doctor..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md"
              >
                {loading ? '⏳ Booking...' : '✨ Confirm Appointment'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/doctors')}
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition text-lg"
              >
                🔙 Back
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <p className="text-gray-700 text-center">
            <span className="text-xl">ℹ️</span> You will receive a confirmation email shortly. Please arrive 10 minutes early.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
