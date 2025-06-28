import React from 'react';
import { MONTHS } from '../constants';

interface DonationFormProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ formData, onInputChange }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Donor Name *
        </label>
        <input
          type="text"
          value={formData.donor_name || ''}
          onChange={(e) => onInputChange('donor_name', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter donor name"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month *
          </label>
          <select
            value={formData.month || ''}
            onChange={(e) => onInputChange('month', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <input
            type="number"
            value={formData.year || ''}
            onChange={(e) => onInputChange('year', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="2020"
            max="2030"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (₹) *
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.amount || ''}
          onChange={(e) => onInputChange('amount', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="0.00"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onInputChange('description', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Optional description"
        />
      </div>
    </>
  );
};

export default DonationForm;
