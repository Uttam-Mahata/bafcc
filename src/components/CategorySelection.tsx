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
        <optgroup label="Boys Categories">
          <option value="u-11">Under-11 Boys</option>
          <option value="u-13">Under-13 Boys</option>
          <option value="u-15">Under-15 Boys</option>
          <option value="u-17">Under-17 Boys</option>
          <option value="open">Open Boys</option>
        </optgroup>
        <optgroup label="Girls Categories">
          <option value="gu-11">Under-11 Girls</option>
          <option value="gu-13">Under-13 Girls</option>
          <option value="gu-15">Under-15 Girls</option>
          <option value="gu-17">Under-17 Girls</option>
          <option value="gopen">Open Girls</option>
        </optgroup>
      </select>
    </div>
  );
};

export default CategorySelection; 