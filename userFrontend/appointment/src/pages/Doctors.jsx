import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors?withRatings=true');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialization) {
      filtered = filtered.filter(doc =>
        doc.specialization.toLowerCase().includes(specialization.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchTerm, specialization]);

  const handleBookAppointment = (doctorId) => {
    navigate('/book-appointment', { state: { doctorId } });
  };

  if (loading) return <div className="text-center mt-20 text-xl text-gray-600">⏳ Loading doctors...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Find Your Doctor</h1>
          <p className="text-xl text-gray-600">Browse our network of certified healthcare professionals</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Search by Doctor Name</label>
              <input
                type="text"
                placeholder="e.g., Dr. John Smith"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Filter by Specialization</label>
              <input
                type="text"
                placeholder="e.g., Cardiology, Surgery"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition text-lg"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500">
              {doctors.length === 0 ? '🏥 No doctors available' : '🔍 No matching doctors found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map(doctor => (
              <div key={doctor._id} className="bg-white rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-xl">
                  <div className="text-4xl mb-3">👨‍⚕️</div>
                  <h3 className="text-2xl font-bold">{doctor.name}</h3>
                  <p className="text-blue-100 text-lg mt-2">{doctor.specialization}</p>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Rating Section */}
                  <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <span className="text-2xl font-bold text-gray-800">
                        {(doctor.averageRating || 0).toFixed(1)}
                      </span>
                      <span className="text-gray-600">({doctor.totalReviews || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Contact Section */}
                  {doctor.contact && (
                    <div className="mb-6 flex items-center gap-3 text-gray-700">
                      <span className="text-xl">📞</span>
                      <p className="font-semibold">{doctor.contact}</p>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="mb-6 flex items-center gap-3 text-gray-700">
                    <span className="text-xl">🕒</span>
                    <p className="font-semibold">Available Now</p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookAppointment(doctor._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition text-lg shadow-md"
                  >
                    📅 Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredDoctors.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">
              Showing <span className="font-bold text-blue-600">{filteredDoctors.length}</span> doctor(s)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
