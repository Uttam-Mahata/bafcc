export type ActiveTab = 'overview' | 'members' | 'player-deposits' | 'member-deposits' | 'donations' | 'expenses';

export type FormType = 'member' | 'player-deposit' | 'member-deposit' | 'donation' | 'expense';

export interface EditingItem {
  type: FormType;
  data: any;
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
