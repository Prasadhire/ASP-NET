import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/theme.css';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Booking from './pages/Booking';
import Ticket from './pages/Ticket';
import MyBookings from './pages/MyBookings';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ConductorLogin from './pages/Conductor/Login';
import ConductorDashboard from './pages/Conductor/Dashboard';
import Reviews from './pages/Reviews';
import Payment from './pages/Payment';
import Analytics from './pages/Admin/Analytics';
import Notifications from './pages/Notifications';
import Reports from './pages/Admin/Reports';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/book/:busId" element={<Booking />} />
              <Route path="/ticket/:bookingId" element={<Ticket />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/reviews/:busId" element={<Reviews />} />
              <Route path="/payment/:bookingId" element={<Payment />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              
              {/* Conductor Routes */}
              <Route path="/conductor/login" element={<ConductorLogin />} />
              <Route
                path="/conductor/*"
                element={
                  <ProtectedRoute roles={['conductor']}>
                    <ConductorDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Notifications */}
              <Route path="/notifications" element={<Notifications />} />
              
              {/* 404 Page */}
              <Route path="*" element={<div className="container text-center py-5"><h2>Page Not Found</h2></div>} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;