import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApplicationService, type Application } from '../../services/ApplicationService';

const ApplicationEdit: React.FC = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!application) return;

    const { name, value } = e.target;
    
    // Handle nested objects for address fields
    if (name.startsWith('address.')) {
      const fieldName = name.split('.')[1];
      setApplication(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          address: {
            ...prev.address,
            [fieldName]: value
          }
        };
      });
    } else if (name.startsWith('current_address.')) {
      const fieldName = name.split('.')[1];
      setApplication(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          current_address: {
            ...prev.current_address,
            [fieldName]: value
          }
        };
      });
    } else {
      // Handle direct fields
      setApplication(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          [name]: value
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!application) return;
    
    setSaving(true);
    try {
      await ApplicationService.getInstance().updateApplication(application.id!, application);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Error saving application');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
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
          onClick={() => navigate('/admin/dashboard')}
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Application</h1>
              <p className="text-gray-600">Registration No: {application.registration_number}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleCancel}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={application.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="father_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    id="father_name"
                    name="father_name"
                    value={application.father_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    id="mother_name"
                    name="mother_name"
                    value={application.mother_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="guardian_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Guardian's Name
                  </label>
                  <input
                    type="text"
                    id="guardian_name"
                    name="guardian_name"
                    value={application.guardian_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={application.dob}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={application.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={application.age}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={application.height}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={application.weight}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="aadhar_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    id="aadhar_number"
                    name="aadhar_number"
                    value={application.aadhar_number || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={application.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="u-11">Under-11</option>
                    <option value="u-13">Under-13</option>
                    <option value="u-15">Under-15</option>
                    <option value="u-17">Under-17</option>
                    <option value="open">Open</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Photo</h2>
              <div className="flex items-start gap-4">
                <div className="h-32 w-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                  {application.image_url ? (
                    <img 
                      src={application.image_url} 
                      alt={application.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/128?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-gray-500">No Photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={application.image_url || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile_number"
                    name="mobile_number"
                    value={application.mobile_number}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="alternate_mobile_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="alternate_mobile_number"
                    name="alternate_mobile_number"
                    value={application.alternate_mobile_number || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Permanent Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address.village" className="block text-sm font-medium text-gray-700 mb-1">
                      Village/Area
                    </label>
                    <input
                      type="text"
                      id="address.village"
                      name="address.village"
                      value={application.address.village}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address.post_office" className="block text-sm font-medium text-gray-700 mb-1">
                      Post Office
                    </label>
                    <input
                      type="text"
                      id="address.post_office"
                      name="address.post_office"
                      value={application.address.post_office}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address.police_station" className="block text-sm font-medium text-gray-700 mb-1">
                      Police Station
                    </label>
                    <input
                      type="text"
                      id="address.police_station"
                      name="address.police_station"
                      value={application.address.police_station}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address.district" className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      id="address.district"
                      name="address.district"
                      value={application.address.district}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="address.pin" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN
                    </label>
                    <input
                      type="text"
                      id="address.pin"
                      name="address.pin"
                      value={application.address.pin}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="current_address.village" className="block text-sm font-medium text-gray-700 mb-1">
                      Village/Area
                    </label>
                    <input
                      type="text"
                      id="current_address.village"
                      name="current_address.village"
                      value={application.current_address.village || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="current_address.post_office" className="block text-sm font-medium text-gray-700 mb-1">
                      Post Office
                    </label>
                    <input
                      type="text"
                      id="current_address.post_office"
                      name="current_address.post_office"
                      value={application.current_address.post_office || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="current_address.police_station" className="block text-sm font-medium text-gray-700 mb-1">
                      Police Station
                    </label>
                    <input
                      type="text"
                      id="current_address.police_station"
                      name="current_address.police_station"
                      value={application.current_address.police_station || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="current_address.district" className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      id="current_address.district"
                      name="current_address.district"
                      value={application.current_address.district || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="current_address.pin" className="block text-sm font-medium text-gray-700 mb-1">
                      PIN
                    </label>
                    <input
                      type="text"
                      id="current_address.pin"
                      name="current_address.pin"
                      value={application.current_address.pin || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">School & Football Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="school_name" className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    id="school_name"
                    name="school_name"
                    value={application.school_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="current_class" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Class
                  </label>
                  <input
                    type="text"
                    id="current_class"
                    name="current_class"
                    value={application.current_class}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="playing_position" className="block text-sm font-medium text-gray-700 mb-1">
                    Playing Position
                  </label>
                  <select
                    id="playing_position"
                    name="playing_position"
                    value={application.playing_position}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="striker">Striker</option>
                    <option value="midfielder">Midfielder</option>
                    <option value="defender">Defender</option>
                    <option value="goalkeeper">Goalkeeper</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="medical_issues" className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Issues
                  </label>
                  <textarea
                    id="medical_issues"
                    name="medical_issues"
                    value={application.medical_issues || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-400 mr-2"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-600 text-white py-2 px-6 rounded-md ${
                  saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationEdit; 