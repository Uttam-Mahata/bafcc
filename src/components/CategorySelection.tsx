import React from 'react';

interface CategorySelectionProps {
  category: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ category, handleChange }) => {
  return (
    <div className="md:col-span-2">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
        Category / বিভাগ
      </label>
      <select
        id="category"
        name="category"
        value={category}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="u-11">Under-11</option>
        <option value="u-13">Under-13</option>
        <option value="u-15">Under-15</option>
        <option value="u-17">Under-17</option>
        <option value="open">Open</option>
      </select>
    </div>
  );
};

export default CategorySelection; 