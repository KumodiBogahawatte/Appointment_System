import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedback');
      setFeedbacks(response.data);
      setError('');
    } catch (err) {
      setError('Feedback service not yet implemented');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading feedback...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold m-0">Feedback Management</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-900 p-3 rounded mb-5 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {feedbacks.length === 0 ? (
          <div className="col-span-full bg-white py-10 rounded-xl text-center text-gray-600">
            {error ? 'Feedback service not available' : 'No feedback found'}
          </div>
        ) : (
          feedbacks.map((feedback) => (
            <div 
              key={feedback._id} 
              className="bg-white p-5 rounded-xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900">{feedback.userName}</span>
                <span className="text-xs text-gray-600">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-3 text-lg">
                {'⭐'.repeat(feedback.rating)}
              </div>
              <p className="text-gray-900 leading-relaxed m-0">{feedback.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feedback;