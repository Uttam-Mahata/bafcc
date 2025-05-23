import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
// @ts-ignore
import { saveAs } from 'file-saver';
import { ApplicationService, type Application } from '../../services/ApplicationService';
import ApplicationPDF from './ApplicationPDF';

const ApplicationView: React.FC = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fetchApplication = useCallback(async () => {
    setLoading(true);
    try {
      if (!id) {
        setError('No application ID provided');
        return;
      }
      
      // Convert string ID to number for API call
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        setError('Invalid application ID');
        return;
      }
      
      const application = await ApplicationService.getInstance().getApplication(numericId);
      setApplication(application);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Application not found');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please login again.');
      } else {
        setError('Error loading application');
      }
      console.error('Error fetching application:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const handleEdit = () => {
    navigate(`/admin/edit/${id}`);
  };

  const handlePrint = () => {
    navigate(`/admin/print/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await ApplicationService.getInstance().deleteApplication(parseInt(id || '0'));
        navigate('/admin/dashboard');
      } catch (err) {
        console.error('Error deleting application:', err);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!application) return;
    
    setGeneratingPDF(true);
    try {
      const doc = <ApplicationPDF application={application} />;
      const blob = await pdf(doc).toBlob();
      const filename = `BAFCC_Application_${application.registration_number.replace(/[\/\\]/g, '_')}.pdf`;
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading application details...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || 'Application not found'}</p>
        <button 
          onClick={handleBack}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Application Details</h1>
              <p className="text-gray-600">Registration No: {application.registration_number}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleBack}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button 
                onClick={handleEdit}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className={`py-2 px-4 rounded text-white ${
                  generatingPDF 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {generatingPDF ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <span className="mr-2">📄</span>
                    Download PDF
                  </>
                )}
              </button>
              <button 
                onClick={handlePrint}
                className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
              >
                <span className="mr-2">🖨️</span>
                Print View
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row mb-8">
            <div className="md:w-1/4 flex justify-center mb-4 md:mb-0">
              <div className="h-40 w-40 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                {application.image_url ? (
                  <img 
                    src={application.image_url} 
                    alt={application.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/160?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-gray-500">No Photo</span>
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">{application.category.toUpperCase()}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-semibold">
                    {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold">{application.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Father's Name</p>
                <p className="font-semibold">{application.father_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mother's Name</p>
                <p className="font-semibold">{application.mother_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guardian's Name</p>
                <p className="font-semibold">{application.guardian_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-semibold">{application.dob}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-semibold">{application.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-semibold">{application.age} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-semibold">{application.height} cm</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-semibold">{application.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="font-semibold">{application.aadhar_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="font-semibold">{application.mobile_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alternate Mobile Number</p>
                <p className="font-semibold">{application.alternate_mobile_number || 'N/A'}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Village/Area</p>
                  <p className="font-semibold">{application.address.village}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Post Office</p>
                  <p className="font-semibold">{application.address.post_office}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Police Station</p>
                  <p className="font-semibold">{application.address.police_station}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">District</p>
                  <p className="font-semibold">{application.address.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PIN</p>
                  <p className="font-semibold">{application.address.pin}</p>
                </div>
              </div>
            </div>

            {application.current_address.village && (
              <div>
                <h3 className="font-medium mb-2">Current Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Village/Area</p>
                    <p className="font-semibold">{application.current_address.village}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Post Office</p>
                    <p className="font-semibold">{application.current_address.post_office}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Police Station</p>
                    <p className="font-semibold">{application.current_address.police_station}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">District</p>
                    <p className="font-semibold">{application.current_address.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">PIN</p>
                    <p className="font-semibold">{application.current_address.pin}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">School & Football Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">School Name</p>
                <p className="font-semibold">{application.school_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Class</p>
                <p className="font-semibold">{application.current_class}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Playing Position</p>
                <p className="font-semibold">{application.playing_position}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Medical Issues</p>
              <p className="font-semibold">{application.medical_issues || 'None'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView; 