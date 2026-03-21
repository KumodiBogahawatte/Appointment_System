import React, { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';

const MyAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/appointments/user/${user.id}`);
      setAppointments(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await api.put(`/appointments/${appointmentId}`, {
        status: newStatus
      });
      setAppointments(appointments.map(apt =>
        apt._id === appointmentId ? response.data : apt
      ));
    } catch (err) {
      setError('Failed to update appointment');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);

    try {
      await api.post('/feedback', {
        appointmentId: selectedAppointment._id,
        userId: user.id,
        doctorId: selectedAppointment.doctor,
        rating: parseInt(rating),
        comment: feedbackText
      });

      setShowFeedbackForm(false);
      setFeedbackText('');
      setRating(5);
      setSelectedAppointment(null);
      alert('Feedback submitted successfully!');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="animate-spin text-4xl">⏳</div>
          Loading appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-xl text-gray-600">Manage and track all your healthcare appointments</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8">
            <p className="font-semibold text-lg">❌ {error}</p>
          </div>
        )}

        {/* Empty State */}
        {appointments.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-md py-16 px-8">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">No Appointments Found</p>
            <p className="text-gray-600 text-lg mb-6">Start by booking your first appointment with one of our healthcare professionals</p>
            <a href="/doctors" className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-blue-600 transition text-lg">
              Browse Doctors
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map(appointment => (
              <div key={appointment._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-blue-500">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-25 px-8 py-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      👨‍⚕️ {appointment.doctor.name || 'Doctor Name'}
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg">
                      {appointment.doctor.specialization || 'Specialization'}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap ml-4 ${
                    appointment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status === 'booked' && '📅 ' }
                    {appointment.status === 'completed' && '✅ '}
                    {appointment.status === 'cancelled' && '❌ '}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>

                {/* Card Body */}
                <div className="px-8 py-6 space-y-4">
                  {/* Date & Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🕒</div>
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">Date & Time</p>
                        <p className="text-lg text-gray-900 font-bold">{new Date(appointment.date).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">🔖</div>
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">Appointment ID</p>
                        <p className="text-lg text-gray-900 font-bold font-mono">{appointment._id.substring(0, 12)}...</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {appointment.notes && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <p className="font-semibold text-gray-700 mb-2">📝 Notes</p>
                      <p className="text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex gap-3 flex-wrap">
                  {appointment.status === 'booked' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition text-sm"
                      >
                        ✅ Mark Complete
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition text-sm"
                      >
                        ❌ Cancel
                      </button>
                    </>
                  )}

                  {appointment.status === 'completed' && (
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowFeedbackForm(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition text-sm"
                    >
                      ⭐ Leave Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackForm && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8">
              <h3 className="text-3xl font-bold mb-2">⭐ Leave Feedback</h3>
              <p className="text-blue-100">Share your experience with {selectedAppointment.doctor.name || 'the doctor'}</p>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                {/* Rating Section */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3 text-lg">How would you rate your experience?</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Poor</option>
                    <option value="1">⭐ Very Poor</option>
                  </select>
                </div>

                {/* Comments Section */}
                <div>
                  <label className="block text-gray-700 font-bold mb-3 text-lg">Your Feedback</label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg resize-none"
                    placeholder="Share your thoughts and experience..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {submittingFeedback ? '⏳ Submitting...' : '✨ Submit Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFeedbackForm(false);
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-lg transition text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
