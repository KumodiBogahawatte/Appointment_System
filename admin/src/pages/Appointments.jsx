import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments');
      setAppointments(response.data);
      setError('');
    } catch (err) {
      setError('Appointment service not yet implemented');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment status');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading appointments...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold m-0">Appointments Management</h1>
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
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Patient</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Doctor</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Date</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Time</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Status</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-gray-600 py-10">
                  {error ? 'Appointment service not available' : 'No appointments found'}
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-300 text-gray-900">{appointment.patientName}</td>
                  <td className="p-4 border-b border-gray-300 text-gray-900">{appointment.doctorName}</td>
                  <td className="p-4 border-b border-gray-300 text-gray-900">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-b border-gray-300 text-gray-900">{appointment.time}</td>
                  <td className="p-4 border-b border-gray-300">
                    <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold capitalize ${
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-900' :
                      appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-900' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-900' :
                      'bg-red-100 text-red-900'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-300">
                    <select 
                      onChange={(e) => updateStatus(appointment._id, e.target.value)}
                      value={appointment.status}
                      className="px-3 py-1.5 border-2 border-gray-300 rounded text-xs cursor-pointer bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;