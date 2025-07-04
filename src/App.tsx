import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './App.css';
import Header from './components/Header';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components for code splitting
const RegistrationForm = lazy(() => import('./components/RegistrationForm'));
const AdminLogin = lazy(() => import('./components/admin/Login'));
const AdminDashboard = lazy(() => import('./components/admin/Dashboard'));
const FinancialDashboard = lazy(() => import('./components/admin/FinancialDashboard'));
const ApplicationView = lazy(() => import('./components/admin/ApplicationView'));
const ApplicationEdit = lazy(() => import('./components/admin/ApplicationEdit'));
const ApplicationPrintView = lazy(() => import('./components/admin/ApplicationPrintView'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen py-8 px-4">
                      <div className="max-w-4xl mx-auto">
                        <Header />
                        <div className="mt-8">
                          <Suspense fallback={
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                              <p className="mt-2 text-gray-600">Loading registration form...</p>
                            </div>
                          }>
                            <RegistrationForm />
                          </Suspense>
                        </div>
                        <footer className="mt-12 text-center text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                          <div className="space-y-3">
                            <p className="font-medium text-gray-800">
                              © {new Date().getFullYear()} Bandhgora Anchal Football Coaching Camp. All rights reserved.
                            </p>
                            <div className="flex justify-center items-center space-x-4 text-xs">
                              <span className="text-gray-500">Empowering young football talent</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              For technical support, please contact the administration team
                            </p>
                          </div>
                        </footer>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Login Route (Public) */}
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
                path="/admin/financial" 
                element={
                  <ProtectedRoute>
                    <FinancialDashboard />
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
              <Route 
                path="/admin/print/:id" 
                element={
                  <ProtectedRoute>
                    <ApplicationPrintView />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
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
