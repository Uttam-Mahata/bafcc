import React from 'react';
import { Save } from 'lucide-react';

interface ModalActionsProps {
  loading: boolean;
  editData?: any;
  onClose: () => void;
}

const ModalActions: React.FC<ModalActionsProps> = ({ loading, editData, onClose }) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {loading ? 'Saving...' : editData ? 'Update' : 'Save'}
      </button>
    </div>
  );
};

export default ModalActions;
