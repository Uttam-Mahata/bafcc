import React from 'react';

interface MemberFormProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ formData, onInputChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Member Name *
      </label>
      <input
        type="text"
        value={formData.name || ''}
        onChange={(e) => onInputChange('name', e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter member name"
        required
      />
    </div>
  );
};

export default MemberForm;
