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
    amount: 50, // Default amount set to 50 rupees
    description: '',
    deposit_date: currentDate.toISOString().split('T')[0] + 'T00:00:00.000Z'
  };
};
