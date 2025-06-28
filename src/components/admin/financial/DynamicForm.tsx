import React from 'react';
import { 
  MemberForm, 
  PlayerDepositForm, 
  MemberDepositForm, 
  DonationForm, 
  ExpenseForm 
} from './forms';
import type { PlayerName, MemberName } from '../../../services/FinancialService';

interface DynamicFormProps {
  formType: 'member' | 'player-deposit' | 'member-deposit' | 'donation' | 'expense';
  formData: any;
  onInputChange: (field: string, value: any) => void;
  playerNames: PlayerName[];
  memberNames: MemberName[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({ 
  formType, 
  formData, 
  onInputChange, 
  playerNames, 
  memberNames 
}) => {
  switch (formType) {
    case 'member':
      return <MemberForm formData={formData} onInputChange={onInputChange} />;
    
    case 'player-deposit':
      return (
        <PlayerDepositForm 
          formData={formData} 
          onInputChange={onInputChange} 
          playerNames={playerNames} 
        />
      );
    
    case 'member-deposit':
      return (
        <MemberDepositForm 
          formData={formData} 
          onInputChange={onInputChange} 
          memberNames={memberNames} 
        />
      );
    
    case 'donation':
      return <DonationForm formData={formData} onInputChange={onInputChange} />;
    
    case 'expense':
      return <ExpenseForm formData={formData} onInputChange={onInputChange} />;
    
    default:
      return null;
  }
};

export default DynamicForm;
