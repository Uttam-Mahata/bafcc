import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApplicationService, type Application } from '../../services/ApplicationService';

const ApplicationPrintView: React.FC = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      if (!id) {
        setError('No application ID provided');
        return;
      }
      
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
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  const formatCategory = (category: string) => {
    switch (category) {
      case 'u-11': return 'Under-11';
      case 'u-13': return 'Under-13';
      case 'u-15': return 'Under-15';
      case 'u-17': return 'Under-17';
      case 'open': return 'Open';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading application...</p>
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
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-container {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            line-height: 1.2;
            color: #000;
            background: white;
          }
          
          .print-header {
            display: flex;
            align-items: center;
            border-bottom: 2px solid #2D3748;
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          
          .print-logo {
            width: 50px;
            height: 50px;
            border: 2px solid #2D3748;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-weight: bold;
            font-size: 8pt;
          }
          
          .print-header-text {
            flex: 1;
            text-align: center;
          }
          
          .print-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 3px;
          }
          
          .print-subtitle {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 2px;
          }
          
          .print-contact {
            font-size: 8pt;
            color: #4A5568;
            margin-bottom: 1px;
          }
          
          .print-photo {
            width: 70px;
            height: 90px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 10px;
          }
          
          .print-photo img {
            width: 65px;
            height: 85px;
            object-fit: cover;
          }
          
          .print-reg-number {
            font-size: 10pt;
            font-weight: bold;
            padding: 5px;
            border: 1px solid #000;
            background: #f8f9fa;
            text-align: center;
            margin-top: 5px;
            margin-left: 10px;
            width: 70px;
          }
          
          .print-main {
            display: flex;
            gap: 10px;
          }
          
          .print-left {
            flex: 2;
          }
          
          .print-right {
            flex: 1;
          }
          
          .print-section {
            font-size: 11pt;
            font-weight: bold;
            margin: 10px 0 8px 0;
            background: #f8f9fa;
            padding: 3px;
            text-align: center;
          }
          
          .print-row {
            display: flex;
            margin-bottom: 4px;
          }
          
          .print-field {
            width: 50%;
            margin-bottom: 3px;
          }
          
          .print-field-full {
            width: 100%;
            margin-bottom: 3px;
          }
          
          .print-label {
            font-size: 8pt;
            font-weight: bold;
            color: #4A5568;
          }
          
          .print-value {
            font-size: 9pt;
            margin-top: 1px;
          }
          
          .print-address-grid {
            display: flex;
            flex-wrap: wrap;
          }
          
          .print-address-field {
            width: 50%;
            margin-bottom: 4px;
            padding-right: 5px;
          }
          
          .print-position-row {
            display: flex;
            align-items: center;
            margin-bottom: 3px;
          }
          
          .print-checkbox {
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            margin-right: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
          }
          
          .print-checkbox-checked {
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            margin-right: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            color: white;
            font-weight: bold;
          }
          
          .print-medical-box {
            border: 1px solid #000;
            padding: 5px;
            min-height: 25px;
            margin-top: 5px;
          }
          
          .print-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #E2E8F0;
          }
          
          .print-signature {
            width: 45%;
            text-align: center;
          }
          
          .print-signature-line {
            border-bottom: 1px solid #000;
            width: 100%;
            margin-top: 15px;
          }
        }
        
        @media screen {
          .print-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>

      {/* Screen Controls */}
      <div className="no-print bg-gray-100 py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Print Preview</h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleBack}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button 
              onClick={handlePrint}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              🖨️ Print
            </button>
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div className="print-container">
        {/* Header */}
        <div className="print-header">
          <div className="print-logo">
            BAFCC
          </div>
          
          <div className="print-header-text">
            <div className="print-title">BANDHGORA ANCHAL FOOTBALL COACHING CAMP</div>
            <div className="print-subtitle">Player Registration Form</div>
            <div className="print-contact">BANDHGORA, JHARGRAM, 721514</div>
            <div className="print-contact">bandhgoraanchalfcc2025@gmail.com</div>
          </div>

          <div className="print-photo">
            {application.image_url ? (
              <img 
                src={application.image_url} 
                alt={application.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextSibling) {
                    (target.nextSibling as HTMLElement).style.display = 'block';
                  }
                }}
              />
            ) : null}
            <div style={{ display: application.image_url ? 'none' : 'block', fontSize: '8pt', textAlign: 'center' }}>
              {application.image_url ? 'Photo Available' : 'No Photo'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="print-main">
          <div className="print-left">
            {/* Personal Information */}
            <div className="print-section">PERSONAL INFORMATION</div>
            
            {/* Registration Number */}
            <div className="print-field-full">
              <div className="print-label">Registration Number:</div>
              <div className="print-value" style={{ fontWeight: 'bold', fontSize: '10pt' }}>{application.registration_number}</div>
            </div>
            
            <div className="print-row">
              <div className="print-field">
                <div className="print-label">Name:</div>
                <div className="print-value">{application.name}</div>
              </div>
              <div className="print-field">
                <div className="print-label">Category:</div>
                <div className="print-value">{formatCategory(application.category)}</div>
              </div>
            </div>

            <div className="print-row">
              <div className="print-field">
                <div className="print-label">Father's Name:</div>
                <div className="print-value">{application.father_name}</div>
              </div>
              <div className="print-field">
                <div className="print-label">Mother's Name:</div>
                <div className="print-value">{application.mother_name}</div>
              </div>
            </div>

            <div className="print-row">
              <div className="print-field">
                <div className="print-label">Guardian:</div>
                <div className="print-value">{application.guardian_name || 'N/A'}</div>
              </div>
              <div className="print-field">
                <div className="print-label">Date of Birth:</div>
                <div className="print-value">{application.dob}</div>
              </div>
            </div>

            <div className="print-row">
              <div className="print-field">
                <div className="print-label">Gender:</div>
                <div className="print-value">{application.gender}</div>
              </div>
              <div className="print-field">
                <div className="print-label">Age:</div>
                <div className="print-value">{application.age} years</div>
              </div>
            </div>

            <div className="print-row">
              <div className="print-field">
                <div className="print-label">Height:</div>
                <div className="print-value">{application.height} cm</div>
              </div>
              <div className="print-field">
                <div className="print-label">Weight:</div>
                <div className="print-value">{application.weight} kg</div>
              </div>
            </div>

            <div className="print-field-full">
              <div className="print-label">Aadhar Number:</div>
              <div className="print-value">{application.aadhar_number || 'N/A'}</div>
            </div>

            {/* Contact Information */}
            <div className="print-section">CONTACT INFORMATION</div>
            
            <div className="print-row">
              <div className="print-field">
                <div className="print-label">Mobile:</div>
                <div className="print-value">{application.mobile_number}</div>
              </div>
              <div className="print-field">
                <div className="print-label">Alternate Mobile:</div>
                <div className="print-value">{application.alternate_mobile_number || 'N/A'}</div>
              </div>
            </div>

            {/* Permanent Address */}
            <div className="print-label" style={{ marginTop: '5px', marginBottom: '3px' }}>Permanent Address:</div>
            <div className="print-address-grid">
              <div className="print-address-field">
                <div className="print-label">Village:</div>
                <div className="print-value">{application.address.village}</div>
              </div>
              <div className="print-address-field">
                <div className="print-label">Post Office:</div>
                <div className="print-value">{application.address.post_office}</div>
              </div>
              <div className="print-address-field">
                <div className="print-label">Police Station:</div>
                <div className="print-value">{application.address.police_station}</div>
              </div>
              <div className="print-address-field">
                <div className="print-label">District:</div>
                <div className="print-value">{application.address.district}</div>
              </div>
              <div className="print-address-field">
                <div className="print-label">PIN:</div>
                <div className="print-value">{application.address.pin}</div>
              </div>
            </div>

            {/* Current Address */}
            {application.current_address.village && (
              <>
                <div className="print-label" style={{ marginTop: '5px', marginBottom: '3px' }}>Current Address:</div>
                <div className="print-address-grid">
                  <div className="print-address-field">
                    <div className="print-label">Village:</div>
                    <div className="print-value">{application.current_address.village}</div>
                  </div>
                  <div className="print-address-field">
                    <div className="print-label">Post Office:</div>
                    <div className="print-value">{application.current_address.post_office}</div>
                  </div>
                  <div className="print-address-field">
                    <div className="print-label">Police Station:</div>
                    <div className="print-value">{application.current_address.police_station}</div>
                  </div>
                  <div className="print-address-field">
                    <div className="print-label">District:</div>
                    <div className="print-value">{application.current_address.district}</div>
                  </div>
                  <div className="print-address-field">
                    <div className="print-label">PIN:</div>
                    <div className="print-value">{application.current_address.pin}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="print-right">
            {/* School Information */}
            <div className="print-section">SCHOOL INFO</div>
            
            <div className="print-field-full">
              <div className="print-label">School Name:</div>
              <div className="print-value">{application.school_name}</div>
            </div>

            <div className="print-field-full">
              <div className="print-label">Current Class:</div>
              <div className="print-value">{application.current_class}</div>
            </div>

            {/* Playing Position */}
            <div className="print-section">PLAYING POSITION</div>
            
            <div className="print-field-full">
              <div className="print-label">Selected Position:</div>
              <div className="print-value" style={{ fontWeight: 'bold', fontSize: '10pt' }}>
                {application.playing_position.charAt(0).toUpperCase() + application.playing_position.slice(1)}
              </div>
            </div>

            {/* Medical Issues */}
            <div className="print-section">MEDICAL ISSUES</div>
            <div className="print-medical-box">
              <div style={{ fontSize: '8pt' }}>{application.medical_issues || 'None reported'}</div>
            </div>

            {/* Submission Date */}
            <div className="print-section" style={{ marginTop: '15px' }}>SUBMISSION INFO</div>
            <div className="print-field-full">
              <div className="print-label">Submitted On:</div>
              <div className="print-value">
                {application.created_at ? new Date(application.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Signatures */}
        {/* <div className="print-footer">
          <div className="print-signature">
            <div className="print-label">Applicant's Signature</div>
            <div className="print-signature-line"></div>
          </div>
          <div className="print-signature">
            <div className="print-label">Guardian's Signature</div>
            <div className="print-signature-line"></div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default ApplicationPrintView; 