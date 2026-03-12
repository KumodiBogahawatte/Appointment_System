import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Overview = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    users: 0,
    appointments: 0,
    feedback: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctorsRes, usersRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/users')
      ]);

      setStats({
        doctors: doctorsRes.data?.length || 0,
        users: usersRes.data?.length || 0,
        appointments: 0,
        feedback: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading statistics...</div>;
  }

  return (
    <div>
      <h1 className="text-gray-900 mb-8 text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="text-5xl w-18 h-18 flex items-center justify-center rounded-xl bg-blue-100">
            👨‍⚕️
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2 font-medium">Total Doctors</h3>
            <p className="text-4xl font-bold text-gray-900">{stats.doctors}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="text-5xl w-18 h-18 flex items-center justify-center rounded-xl bg-green-100">
            👥
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2 font-medium">Total Users</h3>
            <p className="text-4xl font-bold text-gray-900">{stats.users}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="text-5xl w-18 h-18 flex items-center justify-center rounded-xl bg-yellow-100">
            📅
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2 font-medium">Appointments</h3>
            <p className="text-4xl font-bold text-gray-900">{stats.appointments}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="text-5xl w-18 h-18 flex items-center justify-center rounded-xl bg-pink-100">
            💬
          </div>
          <div>
            <h3 className="text-sm text-gray-600 mb-2 font-medium">Feedback</h3>
            <p className="text-4xl font-bold text-gray-900">{stats.feedback}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-gray-900 mb-5 text-xl font-bold">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <a 
            href="/dashboard/doctors" 
            className="px-6 py-3 bg-blue-600 text-white no-underline rounded-md font-medium transition-colors hover:bg-blue-800"
          >
            Add New Doctor
          </a>
          <a 
            href="/dashboard/users" 
            className="px-6 py-3 bg-blue-600 text-white no-underline rounded-md font-medium transition-colors hover:bg-blue-800"
          >
            View All Users
          </a>
          <a 
            href="/dashboard/appointments" 
            className="px-6 py-3 bg-blue-600 text-white no-underline rounded-md font-medium transition-colors hover:bg-blue-800"
          >
            Manage Appointments
          </a>
        </div>
      </div>
    </div>
  );
};

export default Overview;
