import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ApplicationService, type Application } from '../../services/ApplicationService';
import ApplicationPDF from './ApplicationPDF';
import { 
  ArrowLeft, 
  Edit, 
  FileDown, 
  Printer, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  School, 
  UserCircle, 
  ScrollText, 
  HeartPulse 
} from 'lucide-react';

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
    if (!application || !id) return;
    
    setGeneratingPDF(true);
    try {
      // Get application with processed images from backend
      const applicationWithImages = await ApplicationService.getInstance().getApplicationWithImages(parseInt(id));
      
      // Generate PDF using React PDF
      const pdfDoc = <ApplicationPDF 
        application={applicationWithImages.application} 
        images={applicationWithImages.images}
      />;
      
      const pdfBlob = await pdf(pdfDoc).toBlob();
      const filename = `BAFCC_Application_${application.registration_number.replace(/[\/\\]/g, '_')}.pdf`;
      saveAs(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const formatCategory = (category: string) => {
    switch (category) {
      case 'u-11': return 'Under-11 Boys';
      case 'u-13': return 'Under-13 Boys';
      case 'u-15': return 'Under-15 Boys';
      case 'u-17': return 'Under-17 Boys';
      case 'open': return 'Open Boys';
      case 'gu-11': return 'Under-11 Girls';
      case 'gu-13': return 'Under-13 Girls';
      case 'gu-15': return 'Under-15 Girls';
      case 'gu-17': return 'Under-17 Girls';
      case 'gopen': return 'Open Girls';
      default: return category.toUpperCase();
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        {/* Application Card with elevation */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {/* Header with action buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <ScrollText size={24} className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Application Details</h1>
              </div>
              <div className="flex items-center mt-1">
                <p className="text-gray-500 font-mono text-sm bg-blue-50 px-2 py-1 rounded-md">
                  Registration: {application.registration_number}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleBack}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition duration-150 border border-gray-200"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button 
                onClick={handleEdit}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-150"
              >
                <Edit size={18} />
                <span>Edit</span>
              </button>
              <button 
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className={`flex items-center gap-1 py-2 px-4 rounded-lg transition duration-150 ${
                  generatingPDF 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {generatingPDF ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileDown size={18} />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition duration-150"
              >
                <Printer size={18} />
                <span>Print View</span>
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-150"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Applicant Info Section */}
          <div className="flex flex-col lg:flex-row mb-8 gap-6">
            <div className="lg:w-1/4 flex flex-col items-center">
              <div className="h-48 w-48 border-4 border-gray-100 rounded-xl overflow-hidden bg-gray-50 shadow-md">
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
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    <UserCircle size={64} className="text-gray-300 mb-2" />
                    <span className="text-gray-400 text-sm">No Photo Available</span>
                  </div>
                )}
              </div>

              <div className="mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100 w-full">
                <div className="text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formatCategory(application.category)}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4 bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <User size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{application.name}</p>
                  </div>
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
            <div className="flex items-center gap-2 mb-4">
              <Phone size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Primary Contact</p>
                    <p className="font-medium">{application.mobile_number}</p>
                  </div>
                </div>
                
                {application.alternate_mobile_number && (
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Alternate Contact</p>
                      <p className="font-medium">{application.alternate_mobile_number}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-blue-600" />
                  <h3 className="font-medium text-gray-800">Permanent Address</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Village</span>
                    <span className="font-medium">{application.address.village || 'N/A'}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Post Office</span>
                    <span className="font-medium">{application.address.post_office || 'N/A'}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Police Station</span>
                    <span className="font-medium">{application.address.police_station || 'N/A'}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">District</span>
                    <span className="font-medium">{application.address.district || 'N/A'}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">PIN</span>
                    <span className="font-medium">{application.address.pin || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {application.current_address && application.current_address.village && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={18} className="text-blue-600" />
                    <h3 className="font-medium text-gray-800">Current Address</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Village</span>
                      <span className="font-medium">{application.current_address.village || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Post Office</span>
                      <span className="font-medium">{application.current_address.post_office || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Police Station</span>
                      <span className="font-medium">{application.current_address.police_station || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">District</span>
                      <span className="font-medium">{application.current_address.district || 'N/A'}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">PIN</span>
                      <span className="font-medium">{application.current_address.pin || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <School size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">School & Football Information</h2>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <School size={16} className="text-blue-600" />
                    <span className="text-sm text-gray-500">School Name</span>
                  </div>
                  <span className="font-medium pl-6">{application.school_name || 'N/A'}</span>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <ScrollText size={16} className="text-blue-600" />
                    <span className="text-sm text-gray-500">Current Class</span>
                  </div>
                  <span className="font-medium pl-6">{application.current_class || 'N/A'}</span>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={16} className="text-blue-600" />
                    <span className="text-sm text-gray-500">Playing Position</span>
                  </div>
                  <span className="font-medium pl-6">{application.playing_position || 'N/A'}</span>
                </div>
                
                {application.medical_issues && (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <HeartPulse size={16} className="text-blue-600" />
                      <span className="text-sm text-gray-500">Medical Issues</span>
                    </div>
                    <span className="font-medium pl-6">{application.medical_issues}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView;