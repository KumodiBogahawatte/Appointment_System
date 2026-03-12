import React, { useState, useEffect } from 'react';
import api from '../config/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading users...</div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-gray-900 text-3xl font-bold m-0">Users Management</h1>
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
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Email</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Role</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Registered</th>
              <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-600 py-10">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-300 text-gray-900">{user.name}</td>
                  <td className="p-4 border-b border-gray-300 text-gray-900">{user.email}</td>
                  <td className="p-4 border-b border-gray-300">
                    <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold uppercase ${
                      user.role === 'admin' 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-green-100 text-green-900'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-300 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-b border-gray-300">
                    <button 
                      className="px-3 py-1.5 border-none rounded bg-red-500 text-white text-xs cursor-pointer transition-colors hover:bg-red-600"
                      onClick={() => handleDelete(user._id)}
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
    </div>
  );
};

export default Users;