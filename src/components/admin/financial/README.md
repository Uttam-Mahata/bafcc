# Financial Form Components

This directory contains the refactored financial form components that were previously all contained in a single large `FinancialFormModal` component.

## Structure

```
financial/
├── constants.ts                 # Shared constants (months, expense categories, defaults)
├── ModalHeader.tsx             # Modal header with title and close button
├── ModalActions.tsx            # Modal footer with cancel/save buttons
├── DynamicForm.tsx             # Main form renderer that switches between form types
└── forms/
    ├── index.ts                # Export all forms for clean imports
    ├── MemberForm.tsx          # Form for creating/editing members
    ├── PlayerDepositForm.tsx   # Form for player deposits
    ├── MemberDepositForm.tsx   # Form for member deposits
    ├── DonationForm.tsx        # Form for donations
    └── ExpenseForm.tsx         # Form for expenses
```

## Components

### FinancialFormModal (Main Component)
- **Location**: `src/components/admin/FinancialFormModal.tsx`
- **Purpose**: Main modal component that orchestrates all other components
- **Props**: `FinancialFormModalProps`
- **Dependencies**: Uses all sub-components listed below

### ModalHeader
- **Purpose**: Renders the modal header with appropriate icon and title
- **Props**: `formType`, `editData`, `onClose`
- **Features**: Dynamic title and icon based on form type

### ModalActions
- **Purpose**: Renders the modal footer with action buttons
- **Props**: `loading`, `editData`, `onClose`
- **Features**: Loading state, dynamic button text

### DynamicForm
- **Purpose**: Switches between different form types
- **Props**: `formType`, `formData`, `onInputChange`, `playerNames`, `memberNames`
- **Features**: Type-safe form rendering

### Individual Form Components

#### MemberForm
- **Purpose**: Simple form for member name input
- **Props**: `formData`, `onInputChange`

#### PlayerDepositForm
- **Purpose**: Form for player deposit entries
- **Props**: `formData`, `onInputChange`, `playerNames`
- **Fields**: Player selection, month, year, amount, description

#### MemberDepositForm
- **Purpose**: Form for member deposit entries
- **Props**: `formData`, `onInputChange`, `memberNames`
- **Fields**: Member selection, month, year, amount, description

#### DonationForm
- **Purpose**: Form for donation entries
- **Props**: `formData`, `onInputChange`
- **Fields**: Donor name, month, year, amount, description

#### ExpenseForm
- **Purpose**: Form for expense entries
- **Props**: `formData`, `onInputChange`
- **Fields**: Category, month, year, amount, description

## Constants

### MONTHS
Array of month names for dropdown selections.

### EXPENSE_CATEGORIES
Predefined expense categories for expense forms.

### getCurrentDateDefaults()
Function that returns default form data with current month/year.

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Individual form components can be reused elsewhere
3. **Maintainability**: Easier to maintain and update individual components
4. **Type Safety**: Better TypeScript support with focused interfaces
5. **Testing**: Easier to unit test individual components
6. **Code Organization**: Logical grouping of related functionality
7. **Performance**: Potential for better tree-shaking and code splitting

## Usage

```tsx
import FinancialFormModal from './FinancialFormModal';

<FinancialFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  formType="player-deposit"
  editData={editData}
  onSuccess={handleSuccess}
  playerNames={playerNames}
  memberNames={memberNames}
/>
```
