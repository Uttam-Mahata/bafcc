export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const EXPENSE_CATEGORIES = [
  'Ground Rent/Maintenance',
  'Equipment Purchase',
  'Transportation Cost',
  'Referee Fees',
  'Tournament Fees',
  'Medical Expenses',
  'Others'
];

export const getCurrentDateDefaults = () => {
  const currentDate = new Date();
  return {
    month: MONTHS[currentDate.getMonth()],
    year: currentDate.getFullYear(),
    amount: '',
    description: ''
  };
};
