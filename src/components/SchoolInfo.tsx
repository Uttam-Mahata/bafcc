import React from 'react';

interface SchoolInfoProps {
  formData: {
    schoolName: string;
    currentClass: string;
    playingPosition: string;
    medicalIssues: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const SchoolInfo: React.FC<SchoolInfoProps> = ({ formData, handleChange }) => {
  return (
    <div className="md:col-span-2 space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 mb-4">Education & Football Info / শিক্ষা ও ফুটবল তথ্য</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
            School Name / বিদ্যালয়ের নাম
          </label>
          <input
            type="text"
            id="schoolName"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="currentClass" className="block text-sm font-medium text-gray-700 mb-1">
            Current Class / বর্তমান শ্রেণি
          </label>
          <input
            type="text"
            id="currentClass"
            name="currentClass"
            value={formData.currentClass}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="playingPosition" className="block text-sm font-medium text-gray-700 mb-1">
            Playing Position / পছন্দের পজিশন
          </label>
          <select
            id="playingPosition"
            name="playingPosition"
            value={formData.playingPosition}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="striker">Striker / স্ট্রাইকার</option>
            <option value="midfielder">Midfielder / মিডফিল্ডার</option>
            <option value="defender">Defender / ডিফেন্ডার</option>
            <option value="goalkeeper">Goalkeeper / গোলকিপার</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="medicalIssues" className="block text-sm font-medium text-gray-700 mb-1">
            Any Medical Issues / কোন শারীরিক সমস্যা আছে কি না
          </label>
          <textarea
            id="medicalIssues"
            name="medicalIssues"
            value={formData.medicalIssues}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Please mention if any medical condition / শারীরিক সমস্যা থাকলে উল্লেখ করুন"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default SchoolInfo;