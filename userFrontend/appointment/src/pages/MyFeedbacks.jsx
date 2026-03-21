import React, { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';

const MyFeedbacks = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorDetails, setDoctorDetails] = useState({});
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/feedback/user/${user.id}`);
      setFeedbacks(response.data);
      
      // Fetch doctor details and appointment details for each feedback
      const doctors = {};
      const appointments = {};
      
      for (const feedback of response.data) {
        // Fetch doctor details
        if (!doctors[feedback.doctorId]) {
          try {
            const doctorRes = await api.get(`/doctors/${feedback.doctorId}`);
            doctors[feedback.doctorId] = doctorRes.data;
          } catch (err) {
            console.error(`Failed to fetch doctor ${feedback.doctorId}`);
            doctors[feedback.doctorId] = { name: 'Unknown Doctor', specialization: 'Not specified' };
          }
        }
        
        // Fetch appointment details
        if (!appointments[feedback.appointmentId]) {
          try {
            const appointmentRes = await api.get(`/appointments/${feedback.appointmentId}`);
            appointments[feedback.appointmentId] = appointmentRes.data;
          } catch (err) {
            console.error(`Failed to fetch appointment ${feedback.appointmentId}`);
            appointments[feedback.appointmentId] = { 
              date: new Date(), 
              notes: 'No details available',
              status: 'unknown'
            };
          }
        }
      }
      setDoctorDetails(doctors);
      setAppointmentDetails(appointments);
      setError('');
    } catch (err) {
      setError('Failed to load feedbacks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await api.put(`/feedback/${editingFeedback._id}`, {
        rating: parseInt(editRating),
        comment: editComment,
        status: 'submitted'
      });

      // Update the feedback in the list
      setFeedbacks(feedbacks.map(f => 
        f._id === editingFeedback._id ? response.data : f
      ));
      
      // Close edit modal
      setEditingFeedback(null);
      setEditRating(5);
      setEditComment('');
      alert('Feedback updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update feedback');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.delete(`/feedback/${feedbackId}`);
        setFeedbacks(feedbacks.filter(f => f._id !== feedbackId));
        alert('Feedback deleted successfully!');
      } catch (err) {
        setError('Failed to delete feedback');
        console.error(err);
      }
    }
  };

  const openEditModal = (feedback) => {
    setEditingFeedback(feedback);
    setEditRating(feedback.rating);
    setEditComment(feedback.comment || '');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-yellow-500">{'⭐'.repeat(rating)}</span>
        <span className="text-gray-400">{'⭐'.repeat(5 - rating)}</span>
        <span className="text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <div className="animate-spin text-4xl">⏳</div>
          Loading feedbacks...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Feedbacks</h1>
        <p className="text-gray-600 text-lg">Review and manage your submitted feedback with appointment details</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-semibold">❌ {error}</p>
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="text-center bg-white rounded-xl shadow-md py-16 px-8">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-2xl font-bold text-gray-800 mb-2">No Feedbacks Yet</p>
          <p className="text-gray-600 text-lg mb-6">Submit feedback after completing an appointment</p>
          <a href="/appointments" className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-blue-600 transition">
            View My Appointments
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map(feedback => {
            const doctor = doctorDetails[feedback.doctorId] || {};
            const appointment = appointmentDetails[feedback.appointmentId] || {};
            
            return (
              <div key={feedback._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border-l-4 border-yellow-500">
                <div className="p-6">
                  {/* Doctor and Status Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{doctor.name || 'Doctor'}</h3>
                      <p className="text-blue-600 font-semibold">{doctor.specialization || 'Specialization'}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      feedback.status === 'submitted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feedback.status === 'submitted' ? '✅ Submitted' : '📝 Pending'}
                    </span>
                  </div>

                  {/* Appointment Details Section */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="text-xl">📅</span> Appointment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Date & Time</p>
                        <p className="text-gray-800">{formatDate(appointment.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Appointment ID</p>
                        <p className="text-gray-800 font-mono text-sm">{feedback.appointmentId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status || 'Completed'}
                        </span>
                      </div>
                      {appointment.notes && (
                        <div className="col-span-2">
                          <p className="text-sm font-semibold text-gray-600">Notes</p>
                          <p className="text-gray-700 text-sm">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-xl">⭐</span> Your Rating
                    </p>
                    {renderStars(feedback.rating)}
                  </div>

                  {feedback.comment && (
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-xl">💬</span> Your Feedback
                      </p>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{feedback.comment}</p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">Submitted On</p>
                      <p className="text-gray-600">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{new Date(feedback.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Last Updated</p>
                      <p className="text-gray-600">{new Date(feedback.updatedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{new Date(feedback.updatedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons - View Appointment removed */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(feedback)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg transition text-sm flex items-center gap-2"
                    >
                      ✏️ Edit Feedback
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(feedback._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition text-sm flex items-center gap-2"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Feedback Modal */}
      {editingFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
              <h3 className="text-2xl font-bold mb-2">✏️ Edit Feedback</h3>
              <p className="text-blue-100">Update your experience with {doctorDetails[editingFeedback.doctorId]?.name || 'the doctor'}</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleUpdateFeedback} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Rating</label>
                  <select
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Poor</option>
                    <option value="1">⭐ Very Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Your Feedback</label>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none"
                    placeholder="Share your thoughts and experience..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50"
                  >
                    {updating ? '⏳ Updating...' : '💾 Update Feedback'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingFeedback(null);
                      setEditRating(5);
                      setEditComment('');
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg transition"
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

export default MyFeedbacks;