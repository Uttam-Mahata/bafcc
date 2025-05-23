import React from 'react';

interface ContactInfoProps {
  formData: {
    mobileNumber: string;
    alternateMobileNumber: string;
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
    sameAddress: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSameAddressChange: (checked: boolean) => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ formData, handleChange, handleSameAddressChange }) => {
  return (
    <div className="md:col-span-2 space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 mb-4">Contact Information / যোগাযোগের বিবরণ</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number / মোবাইল নম্বর
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            pattern="[0-9]{10}"
            placeholder="10 digit mobile number"
            required
          />
        </div>
        
        <div>
          <label htmlFor="alternateMobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Alternate Mobile Number / বিকল্প মোবাইল নম্বর
          </label>
          <input
            type="tel"
            id="alternateMobileNumber"
            name="alternateMobileNumber"
            value={formData.alternateMobileNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            pattern="[0-9]{10}"
            placeholder="10 digit mobile number (optional)"
          />
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Permanent Address / স্থায়ী ঠিকানা</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address.village" className="block text-sm font-medium text-gray-700 mb-1">
              Village/Area / গ্রাম/এলাকা
            </label>
            <input
              type="text"
              id="address.village"
              name="address.village"
              value={formData.address.village}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address.postOffice" className="block text-sm font-medium text-gray-700 mb-1">
              Post Office / পোস্ট অফিস
            </label>
            <input
              type="text"
              id="address.postOffice"
              name="address.postOffice"
              value={formData.address.postOffice}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address.policeStation" className="block text-sm font-medium text-gray-700 mb-1">
              Police Station / থানা
            </label>
            <input
              type="text"
              id="address.policeStation"
              name="address.policeStation"
              value={formData.address.policeStation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address.district" className="block text-sm font-medium text-gray-700 mb-1">
              District / জেলা
            </label>
            <input
              type="text"
              id="address.district"
              name="address.district"
              value={formData.address.district}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address.pin" className="block text-sm font-medium text-gray-700 mb-1">
              PIN / পিন
            </label>
            <input
              type="text"
              id="address.pin"
              name="address.pin"
              value={formData.address.pin}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              pattern="[0-9]{6}"
              placeholder="6 digits"
              required
            />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="sameAddress"
            checked={formData.sameAddress}
            onChange={(e) => handleSameAddressChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sameAddress" className="ml-2 block text-sm text-gray-700">
            Current address is same as permanent address / বর্তমান ঠিকানা স্থায়ী ঠিকানার মতোই
          </label>
        </div>
        
        <h4 className="text-md font-medium mb-2">Current Address / বর্তমান ঠিকানা</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentAddress.village" className="block text-sm font-medium text-gray-700 mb-1">
              Village/Area / গ্রাম/এলাকা
            </label>
            <input
              type="text"
              id="currentAddress.village"
              name="currentAddress.village"
              value={formData.currentAddress.village}
              onChange={handleChange}
              disabled={formData.sameAddress}
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formData.sameAddress ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div>
            <label htmlFor="currentAddress.postOffice" className="block text-sm font-medium text-gray-700 mb-1">
              Post Office / পোস্ট অফিস
            </label>
            <input
              type="text"
              id="currentAddress.postOffice"
              name="currentAddress.postOffice"
              value={formData.currentAddress.postOffice}
              onChange={handleChange}
              disabled={formData.sameAddress}
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formData.sameAddress ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div>
            <label htmlFor="currentAddress.policeStation" className="block text-sm font-medium text-gray-700 mb-1">
              Police Station / থানা
            </label>
            <input
              type="text"
              id="currentAddress.policeStation"
              name="currentAddress.policeStation"
              value={formData.currentAddress.policeStation}
              onChange={handleChange}
              disabled={formData.sameAddress}
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formData.sameAddress ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div>
            <label htmlFor="currentAddress.district" className="block text-sm font-medium text-gray-700 mb-1">
              District / জেলা
            </label>
            <input
              type="text"
              id="currentAddress.district"
              name="currentAddress.district"
              value={formData.currentAddress.district}
              onChange={handleChange}
              disabled={formData.sameAddress}
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formData.sameAddress ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
          
          <div>
            <label htmlFor="currentAddress.pin" className="block text-sm font-medium text-gray-700 mb-1">
              PIN / পিন
            </label>
            <input
              type="text"
              id="currentAddress.pin"
              name="currentAddress.pin"
              value={formData.currentAddress.pin}
              onChange={handleChange}
              disabled={formData.sameAddress}
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formData.sameAddress ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              pattern="[0-9]{6}"
              placeholder="6 digits"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo; 