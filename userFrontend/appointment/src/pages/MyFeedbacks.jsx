import React, { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';

const MyFeedbacks = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorDetails, setDoctorDetails] = useState({});

  useEffect(() => {
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/feedback/user/${user.id}`);
      setFeedbacks(response.data);
      
      // Fetch doctor details for each feedback
      const doctors = {};
      for (const feedback of response.data) {
        if (!doctors[feedback.doctorId]) {
          try {
            const doctorRes = await api.get(`/doctors/${feedback.doctorId}`);
            doctors[feedback.doctorId] = doctorRes.data;
          } catch (err) {
            console.error(`Failed to fetch doctor ${feedback.doctorId}`);
            doctors[feedback.doctorId] = { name: 'Unknown Doctor' };
          }
        }
      }
      setDoctorDetails(doctors);
      setError('');
    } catch (err) {
      setError('Failed to load feedbacks');
      console.error(err);
    } finally {
      setLoading(false);
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

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-yellow-500">{'⭐'.repeat(rating)}</span>
        <span className="text-gray-400">{'⭐'.repeat(5 - rating)}</span>
        <span className="text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center mt-10">Loading feedbacks...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Feedbacks</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="text-center text-gray-600 py-10 bg-gray-50 rounded-lg">
          <p className="text-lg">No feedbacks submitted yet</p>
          <p className="text-sm mt-2">Submit feedback after completing an appointment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(feedback => {
            const doctor = doctorDetails[feedback.doctorId] || {};
            return (
              <div key={feedback._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{doctor.name || 'Doctor'}</h3>
                    <p className="text-gray-600">{doctor.specialization || 'Specialization'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    feedback.status === 'submitted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="font-semibold mb-2">Rating</p>
                  {renderStars(feedback.rating)}
                </div>

                {feedback.comment && (
                  <div className="mb-4 pb-4 border-b">
                    <p className="font-semibold text-sm mb-2">Your Feedback</p>
                    <p className="text-gray-700">{feedback.comment}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div>
                    <p className="font-semibold">Submitted On</p>
                    <p>{new Date(feedback.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Feedback ID</p>
                    <p className="font-mono text-xs">{feedback._id.substring(0, 8)}...</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                  >
                    Delete Feedback
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyFeedbacks;
