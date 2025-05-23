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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <div className="min-h-screen py-8 px-4">
                  <div className="max-w-4xl mx-auto">
                    <Header />
                    <div className="mt-8">
                      <RegistrationForm />
                    </div>
                    <footer className="mt-12 text-center text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                      <div className="space-y-3">
                        <p className="font-medium text-gray-800">
                          © {new Date().getFullYear()} Bandhgora Anchal Football Coaching Camp. All rights reserved.
                        </p>
                        <div className="flex justify-center items-center space-x-4 text-xs">
                          <span className="text-gray-500">Empowering young football talent</span>
                          <span className="text-gray-300">•</span>
                          <a 
                            href="/admin/login" 
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
                          >
                            Admin Portal
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          For technical support, please contact the administration team
                        </p>
                      </div>
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
            theme="colored"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
