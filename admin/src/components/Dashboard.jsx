import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className={`bg-gray-900 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="p-5 border-b border-white/10">
          <h2 className="text-xl font-bold m-0">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 py-5 flex flex-col gap-1">
          <NavLink 
            to="/dashboard" 
            end 
            className={({ isActive }) => 
              `flex items-center gap-3 px-5 py-3 text-white/70 no-underline transition-all border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-l-blue-600' 
                  : 'border-l-transparent hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-xl">📊</span>
            <span>Overview</span>
          </NavLink>
          <NavLink 
            to="/dashboard/doctors" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-5 py-3 text-white/70 no-underline transition-all border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-l-blue-600' 
                  : 'border-l-transparent hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-xl">👨‍⚕️</span>
            <span>Doctors</span>
          </NavLink>
          <NavLink 
            to="/dashboard/users" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-5 py-3 text-white/70 no-underline transition-all border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-l-blue-600' 
                  : 'border-l-transparent hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-xl">👥</span>
            <span>Users</span>
          </NavLink>
          <NavLink 
            to="/dashboard/appointments" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-5 py-3 text-white/70 no-underline transition-all border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-l-blue-600' 
                  : 'border-l-transparent hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-xl">📅</span>
            <span>Appointments</span>
          </NavLink>
          <NavLink 
            to="/dashboard/feedback" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-5 py-3 text-white/70 no-underline transition-all border-l-4 ${
                isActive 
                  ? 'bg-white/10 text-white border-l-blue-600' 
                  : 'border-l-transparent hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-xl">💬</span>
            <span>Feedback</span>
          </NavLink>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-5">
          <button 
            className="bg-transparent border-none text-2xl cursor-pointer p-2 text-gray-900"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">{currentUser?.email}</span>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-red-500 text-white border-none rounded-md cursor-pointer text-sm transition-colors hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
