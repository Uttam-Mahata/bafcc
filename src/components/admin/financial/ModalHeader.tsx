import React from 'react';
import { X, DollarSign, User } from 'lucide-react';

interface ModalHeaderProps {
  formType: 'member' | 'player-deposit' | 'member-deposit' | 'donation' | 'expense';
  editData?: any;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ formType, editData, onClose }) => {
  const getModalTitle = () => {
    const action = editData ? 'Edit' : 'Add';
    switch (formType) {
      case 'member':
        return `${action} Member`;
      case 'player-deposit':
        return `${action} Player Deposit`;
      case 'member-deposit':
        return `${action} Member Deposit`;
      case 'donation':
        return `${action} Donation`;
      case 'expense':
        return `${action} Expense`;
      default:
        return action;
    }
  };

  const getModalIcon = () => {
    switch (formType) {
      case 'member':
        return <User className="w-6 h-6 text-blue-600" />;
      case 'player-deposit':
      case 'member-deposit':
      case 'donation':
        return <DollarSign className="w-6 h-6 text-green-600" />;
      case 'expense':
        return <DollarSign className="w-6 h-6 text-red-600" />;
      default:
        return <DollarSign className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        {getModalIcon()}
        <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ModalHeader;
