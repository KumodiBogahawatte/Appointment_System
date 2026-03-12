import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contact: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      console.log('API Response:', response.data);
      
      // Ensure doctors is always an array
      const doctorsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.doctors || []);
      
      setDoctors(doctorsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
      setDoctors([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentDoctor(null);
    setFormData({ name: '', specialization: '', contact: '' });
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditMode(true);
    setCurrentDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      contact: doctor.contact || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', specialization: '', contact: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Submitting form data:', formData);
      if (editMode && currentDoctor) {
        const response = await api.put(`/doctors/${currentDoctor._id}`, formData);
        console.log('Update response:', response.data);
      } else {
        const response = await api.post('/doctors', formData);
        console.log('Create response:', response.data);
      }
      fetchDoctors();
      closeModal();
    } catch (err) {
      const errorMsg = editMode ? 'Failed to update doctor' : 'Failed to add doctor';
      setError(errorMsg + ': ' + (err.response?.data?.message || err.message));
      console.error('Submit error:', err.response || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }

    try {
      await api.delete(`/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      setError('Failed to delete doctor');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading doctors...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-gray-900 text-3xl font-bold m-0">Doctors Management</h1>
        <button 
          className="px-6 py-3 bg-blue-600 text-white border-none rounded-md text-sm font-semibold cursor-pointer transition-colors hover:bg-blue-800"
          onClick={openAddModal}
        >
          + Add Doctor
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-900 p-3 rounded mb-5 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Name</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Specialization</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Contact</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-600 py-10">
                  No doctors found
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-300 text-gray-900">{doctor.name}</td>
                  <td className="p-4 border-b border-gray-300 text-gray-900">{doctor.specialization}</td>
                  <td className="p-4 border-b border-gray-300 text-gray-900">{doctor.contact || 'N/A'}</td>
                  <td className="p-4 border-b border-gray-300">
                    <button 
                      className="px-3 py-1.5 border-none rounded bg-blue-600 text-white text-xs cursor-pointer mr-2 transition-colors hover:bg-blue-800"
                      onClick={() => openEditModal(doctor)}
                    >
                      Edit
                    </button>
                    <button 
                      className="px-3 py-1.5 border-none rounded bg-red-500 text-white text-xs cursor-pointer transition-colors hover:bg-red-600"
                      onClick={() => handleDelete(doctor._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-300">
              <h2 className="m-0 text-gray-900 text-xl font-bold">
                {editMode ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button 
                className="bg-transparent border-none text-4xl cursor-pointer text-gray-600 leading-none hover:text-gray-900"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2 font-semibold text-gray-900 text-sm">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Dr. John Doe"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="specialization" className="block mb-2 font-semibold text-gray-900 text-sm">
                  Specialization *
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  placeholder="Cardiologist"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="mb-0">
                <label htmlFor="contact" className="block mb-2 font-semibold text-gray-900 text-sm">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm transition-colors focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex gap-3 mt-6 pt-5 border-t border-gray-300">
                <button 
                  type="button" 
                  className="flex-1 px-3 py-3 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors bg-gray-100 text-gray-900 hover:bg-gray-200"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-3 py-3 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors bg-blue-600 text-white hover:bg-blue-800"
                >
                  {editMode ? 'Update' : 'Add'} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;