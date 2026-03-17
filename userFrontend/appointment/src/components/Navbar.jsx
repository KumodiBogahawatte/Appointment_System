import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:text-blue-100 transition">
          <span>🏥</span>
          HealthCare Pro
        </Link>
        
        {user ? (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1">
              <span className="text-blue-100">👤</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/doctors" className="hover:text-blue-100 transition font-semibold">
                Doctors
              </Link>
              <Link to="/appointments" className="hover:text-blue-100 transition font-semibold">
                Appointments
              </Link>
              <Link to="/feedbacks" className="hover:text-blue-100 transition font-semibold">
                Feedbacks
              </Link>
            </nav>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-bold transition shadow"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-blue-100 transition font-semibold">
              Login
            </Link>
            <Link to="/register" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
