import React, { useState, useEffect } from 'react';
import PersonalInfo from './PersonalInfo';
import ContactInfo from './ContactInfo';
import SchoolInfo from './SchoolInfo';
import CategorySelection from './CategorySelection';
import { ApplicationService } from '../services/ApplicationService';
import { toast } from 'react-toastify';

interface FormData {
  name: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  dob: string;
  gender: string;
  age: string;
  aadharNumber: string;
  height: string;
  weight: string;
  mobileNumber: string;
  alternateMobileNumber: string;
  imageUrl: string;
  address: {
    village: string;
    postOffice: string;
    district: string;
    pin: string;
  };
  currentAddress: {
    village: string;
    postOffice: string;
    district: string;
    pin: string;
  };
  schoolName: string;
  currentClass: string;
  playingPosition: string;
  medicalIssues: string;
  category: string;
  registrationNumber: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    fatherName: '',
    motherName: '',
    guardianName: '',
    dob: '',
    gender: 'male',
    age: '',
    aadharNumber: '',
    height: '',
    weight: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    imageUrl: '',
    address: {
      village: '',
      postOffice: '',
      district: '',
      pin: ''
    },
    currentAddress: {
      village: '',
      postOffice: '',
      district: '',
      pin: ''
    },
    schoolName: '',
    currentClass: '',
    playingPosition: 'striker',
    medicalIssues: '',
    category: 'u-11',
    registrationNumber: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const applicationService = ApplicationService.getInstance();

  // Generate unique registration number when category changes
  useEffect(() => {
    generateRegistrationNumber(formData.category);
  }, [formData.category]);

  const generateRegistrationNumber = (category: string) => {
    const prefix = category.toUpperCase().replace('-', '');
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 900 + 100);
    const regNumber = `${prefix}-${timestamp}-${random}`;
    
    setFormData(prev => ({ ...prev, registrationNumber: regNumber }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const apiData = {
        name: formData.name,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        guardian_name: formData.guardianName || undefined,
        dob: formData.dob,
        gender: formData.gender,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        aadhar_number: formData.aadharNumber || undefined,
        mobile_number: formData.mobileNumber,
        alternate_mobile_number: formData.alternateMobileNumber || undefined,
        image_url: formData.imageUrl || undefined,
        address: {
          village: formData.address.village,
          post_office: formData.address.postOffice,
          district: formData.address.district,
          pin: formData.address.pin
        },
        current_address: {
          village: formData.currentAddress.village,
          post_office: formData.currentAddress.postOffice,
          district: formData.currentAddress.district,
          pin: formData.currentAddress.pin
        },
        school_name: formData.schoolName,
        current_class: formData.currentClass,
        playing_position: formData.playingPosition,
        medical_issues: formData.medicalIssues || undefined,
        category: formData.category
      };
      const response = await applicationService.createApplication(apiData);
      
      toast.success(`Application submitted successfully! Registration Number: ${response.registration_number}`);
      console.log('Application created:', response);
      
      // Update the form with the returned registration number
      setFormData(prev => ({
        ...prev,
        registrationNumber: response.registration_number
      }));
      
      // Optionally redirect to a success page or clear the form after a delay
      setTimeout(() => {
        setFormData({
          name: '',
          fatherName: '',
          motherName: '',
          guardianName: '',
          dob: '',
          gender: 'male',
          age: '',
          aadharNumber: '',
          height: '',
          weight: '',
          mobileNumber: '',
          alternateMobileNumber: '',
          imageUrl: '',
          address: {
            village: '',
            postOffice: '',
            district: '',
            pin: ''
          },
          currentAddress: {
            village: '',
            postOffice: '',
            district: '',
            pin: ''
          },
          schoolName: '',
          currentClass: '',
          playingPosition: 'striker',
          medicalIssues: '',
          category: 'u-11',
          registrationNumber: ''
        });
      }, 5000); // Clear form after 5 seconds to allow user to see the registration number
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Add image load error handling
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/128?text=No+Image';
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-semibold">
            Registration No: <span className="text-blue-600">{formData.registrationNumber}</span>
          </h3>
          
          <div className="w-full md:w-auto flex flex-col items-center">
            <div className="h-32 w-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100 mb-2">
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="Candidate" 
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-gray-500">No Photo</span>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-64">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL / ছবির লিঙ্ক
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <CategorySelection 
          category={formData.category} 
          handleChange={handleChange} 
        />

        <PersonalInfo 
          formData={formData} 
          handleChange={handleChange} 
        />

        <ContactInfo 
          formData={formData} 
          handleChange={handleChange} 
        />

        <SchoolInfo 
          formData={formData} 
          handleChange={handleChange} 
        />

        <div className="md:col-span-2">
          <button 
            type="submit" 
            className={`bg-blue-800 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200 ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm; 