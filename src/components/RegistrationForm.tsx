import React, { useState } from 'react';
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
    policeStation: string;
    district: string;
    pin: string;
  };
  currentAddress: {
    village: string;
    postOffice: string;
    policeStation: string;
    district: string;
    pin: string;
  };
  schoolName: string;
  currentClass: string;
  playingPosition: string;
  medicalIssues: string;
  category: string;
  sameAddress: boolean;
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
      policeStation: '',
      district: '',
      pin: ''
    },
    currentAddress: {
      village: '',
      postOffice: '',
      policeStation: '',
      district: '',
      pin: ''
    },
    schoolName: '',
    currentClass: '',
    playingPosition: 'striker',
    medicalIssues: '',
    category: 'u-11',
    sameAddress: true
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedRegistrationNumber, setSubmittedRegistrationNumber] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const applicationService = ApplicationService.getInstance();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear any previous submit error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
    
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

  const handleSameAddressChange = (checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        // Copy permanent address to current address
        return {
          ...prev,
          sameAddress: checked,
          currentAddress: {
            village: prev.address.village,
            postOffice: prev.address.postOffice,
            policeStation: prev.address.policeStation,
            district: prev.address.district,
            pin: prev.address.pin
          }
        };
      } else {
        // Clear current address when unchecked
        return {
          ...prev,
          sameAddress: checked,
          currentAddress: {
            village: '',
            postOffice: '',
            policeStation: '',
            district: '',
            pin: ''
          }
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.fatherName.trim()) {
        throw new Error('Father\'s name is required');
      }
      if (!formData.motherName.trim()) {
        throw new Error('Mother\'s name is required');
      }
      if (!formData.dob) {
        throw new Error('Date of birth is required');
      }
      if (!formData.age || parseInt(formData.age) < 5 || parseInt(formData.age) > 25) {
        throw new Error('Age must be between 5 and 25');
      }
      if (!formData.mobileNumber.trim() || formData.mobileNumber.length !== 10) {
        throw new Error('Valid 10-digit mobile number is required');
      }
      if (!formData.address.village.trim()) {
        throw new Error('Permanent address village is required');
      }

      console.log('Submitting application with category:', formData.category);
      
      const apiData = {
        name: formData.name.trim(),
        father_name: formData.fatherName.trim(),
        mother_name: formData.motherName.trim(),
        guardian_name: formData.guardianName.trim() || undefined,
        dob: formData.dob,
        gender: formData.gender,
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        aadhar_number: formData.aadharNumber.trim() || undefined,
        mobile_number: formData.mobileNumber.trim(),
        alternate_mobile_number: formData.alternateMobileNumber.trim() || undefined,
        image_url: formData.imageUrl.trim() || undefined,
        address: {
          village: formData.address.village.trim(),
          post_office: formData.address.postOffice.trim(),
          police_station: formData.address.policeStation.trim(),
          district: formData.address.district.trim(),
          pin: formData.address.pin.trim()
        },
        current_address: {
          village: formData.currentAddress.village.trim() || formData.address.village.trim(),
          post_office: formData.currentAddress.postOffice.trim() || formData.address.postOffice.trim(),
          police_station: formData.currentAddress.policeStation.trim() || formData.address.policeStation.trim(),
          district: formData.currentAddress.district.trim() || formData.address.district.trim(),
          pin: formData.currentAddress.pin.trim() || formData.address.pin.trim()
        },
        school_name: formData.schoolName.trim(),
        current_class: formData.currentClass.trim(),
        playing_position: formData.playingPosition,
        medical_issues: formData.medicalIssues.trim() || undefined,
        category: formData.category
      };

      console.log('API Data being sent:', apiData);
      
      const response = await applicationService.createApplication(apiData);
      
      toast.success(`Application submitted successfully! Registration Number: ${response.registration_number}`);
      console.log('Application created:', response);
      
      // Set the registration number from response
      setSubmittedRegistrationNumber(response.registration_number);
      
      // Clear form after 10 seconds to allow user to see and note down the registration number
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
            policeStation: '',
            district: '',
            pin: ''
          },
          currentAddress: {
            village: '',
            postOffice: '',
            policeStation: '',
            district: '',
            pin: ''
          },
          schoolName: '',
          currentClass: '',
          playingPosition: 'striker',
          medicalIssues: '',
          category: 'u-11',
          sameAddress: true
        });
        setSubmittedRegistrationNumber('');
      }, 10000); // Clear form after 10 seconds
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      
      let errorMessage = 'Failed to submit application. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      toast.error(errorMessage);
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
        {submittedRegistrationNumber && (
          <div className="md:col-span-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-semibold">Application Submitted Successfully!</p>
                <p>Your Registration Number: <span className="font-bold text-lg">{submittedRegistrationNumber}</span></p>
                <p className="text-sm mt-1">Please note down this registration number for future reference.</p>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="md:col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-semibold">Submission Failed</p>
                <p className="text-sm mt-1">{submitError}</p>
                <p className="text-xs mt-2">Please check your information and try again.</p>
              </div>
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {!submittedRegistrationNumber && (
            <h3 className="text-lg font-semibold text-gray-600">
              Registration Number will be generated after submission
            </h3>
          )}
          
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
          handleSameAddressChange={handleSameAddressChange}
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