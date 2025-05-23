import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import RegistrationForm from './components/RegistrationForm';
import AdminLogin from './components/admin/Login';
import AdminDashboard from './components/admin/Dashboard';
import ApplicationView from './components/admin/ApplicationView';
import ApplicationEdit from './components/admin/ApplicationEdit';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <div className="min-h-screen bg-gray-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                  <Header />
                  <div className="mt-6">
                    <RegistrationForm />
                  </div>
                  <footer className="mt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Bandhgora Anchal Football Coaching Camp. All rights reserved.</p>
                    <p className="mt-1">
                      <a href="/admin/login" className="text-blue-600 hover:underline">Admin Login</a>
                    </p>
                  </footer>
                </div>
              </div>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/view/:id" 
            element={
              <ProtectedRoute>
                <ApplicationView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/edit/:id" 
            element={
              <ProtectedRoute>
                <ApplicationEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={5000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
