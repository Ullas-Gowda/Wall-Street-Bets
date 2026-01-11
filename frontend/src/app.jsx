import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Trade from './pages/Trade';
import Portfolio from './pages/Portfolio';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        {user && <Navbar />}
        <Routes>
          {/* Public Routes */}
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}

          {/* Protected Routes */}
          {user && (
            <>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
              <Route path="/trade" element={<ProtectedRoute><Trade /></ProtectedRoute>} />
              <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
