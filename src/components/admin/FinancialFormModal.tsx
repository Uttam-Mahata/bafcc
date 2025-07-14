import React, { useState, useEffect } from 'react';
import FinancialService from '../../services/FinancialService';
import type {
  MemberCreate,
  PlayerDepositCreate,
  MemberDepositCreate,
  DonationCreate,
  ExpenseCreate,
  PlayerName,
  MemberName
} from '../../services/FinancialService';
import { toast } from 'react-toastify';
import ModalHeader from './financial/ModalHeader';
import ModalActions from './financial/ModalActions';
import DynamicForm from './financial/DynamicForm';
import { getCurrentDateDefaults, EXPENSE_CATEGORIES } from './financial/constants';

interface FinancialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: 'member' | 'player-deposit' | 'member-deposit' | 'donation' | 'expense';
  editData?: any;
  onSuccess: () => void;
  playerNames: PlayerName[];
  memberNames: MemberName[];
}

const FinancialFormModal: React.FC<FinancialFormModalProps> = ({
  isOpen,
  onClose,
  formType,
  editData,
  onSuccess,
  playerNames,
  memberNames
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData(editData);
      } else {
        // Initialize with default values
        const defaultData = getCurrentDateDefaults();

        switch (formType) {
          case 'member':
            setFormData({ name: '' });
            break;
          case 'player-deposit':
            setFormData({ ...defaultData, player_id: '' });
            break;
          case 'member-deposit':
            setFormData({ ...defaultData, member_id: '' });
            break;
          case 'donation':
            setFormData({ ...defaultData, donor_name: '' });
            break;
          case 'expense':
            setFormData({ ...defaultData, category: EXPENSE_CATEGORIES[0] });
            break;
        }
      }
    }
  }, [isOpen, editData, formType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const financialService = FinancialService.getInstance();

      if (editData) {
        // Update existing record
        switch (formType) {
          case 'member':
            await financialService.updateMember(editData.id, formData);
            toast.success('Member updated successfully');
            break;
          case 'player-deposit':
            await financialService.updatePlayerDeposit(editData.id, formData);
            toast.success('Player deposit updated successfully');
            break;
          case 'member-deposit':
            await financialService.updateMemberDeposit(editData.id, formData);
            toast.success('Member deposit updated successfully');
            break;
          case 'donation':
            await financialService.updateDonation(editData.id, formData);
            toast.success('Donation updated successfully');
            break;
          case 'expense':
            await financialService.updateExpense(editData.id, formData);
            toast.success('Expense updated successfully');
            break;
        }
      } else {
        // Create new record
        switch (formType) {
          case 'member':
            await financialService.createMember(formData as MemberCreate);
            toast.success('Member created successfully');
            break;
          case 'player-deposit':
            await financialService.createPlayerDeposit({
              ...formData,
              player_id: parseInt(formData.player_id),
              amount: parseFloat(formData.amount)
            } as PlayerDepositCreate);
            toast.success('Player deposit created successfully');
            break;
          case 'member-deposit':
            await financialService.createMemberDeposit({
              ...formData,
              member_id: parseInt(formData.member_id),
              amount: parseFloat(formData.amount)
            } as MemberDepositCreate);
            toast.success('Member deposit created successfully');
            break;
          case 'donation':
            await financialService.createDonation({
              ...formData,
              amount: parseFloat(formData.amount)
            } as DonationCreate);
            toast.success('Donation created successfully');
            break;
          case 'expense':
            await financialService.createExpense({
              ...formData,
              amount: parseFloat(formData.amount),
              year: parseInt(formData.year, 10)
            } as ExpenseCreate);
            toast.success('Expense created successfully');
            break;
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader formType={formType} editData={editData} onClose={onClose} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <DynamicForm
            formType={formType}
            formData={formData}
            onInputChange={handleInputChange}
            playerNames={playerNames}
            memberNames={memberNames}
          />

          <ModalActions loading={loading} editData={editData} onClose={onClose} />
        </form>
      </div>
    </div>
  );
};

export default FinancialFormModal;
