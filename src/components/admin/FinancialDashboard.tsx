import React, { useState, useEffect } from 'react';
import FinancialService from '../../services/FinancialService';
import type {
  Member,
  PlayerDeposit,
  MemberDeposit,
  Donation,
  Expense,
  FinancialReport,
  PlayerName,
  MemberName
} from '../../services/FinancialService';
import FinancialFormModal from './FinancialFormModal';
import {
  FinancialDashboardHeader,
  FinancialDashboardTabs,
  OverviewSection,
  MembersSection,
  PlayerDepositsSection,
  MemberDepositsSection,
  DonationsSection,
  ExpensesSection,
  MONTHS
} from './financial';
import type {
  ActiveTab,
  FormType,
  EditingItem
} from './financial';

const FinancialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedMonth, setSelectedMonth] = useState<string>(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [period, setPeriod] = useState<'monthly' | 'yearly' | 'all'>('monthly');

  // Player deposits filtering states
  const [_playerDepositFilters, setPlayerDepositFilters] = useState<{
    month?: string;
    year?: number;
    playerId?: number;
    search?: string;
  }>({});

  // Other section filters
  const [memberDepositFilters, setMemberDepositFilters] = useState<{
    month?: string;
    year?: number;
    memberId?: number;
    search?: string;
  }>({});

  const [donationFilters, setDonationFilters] = useState<{
    month?: string;
    year?: number;
    search?: string;
  }>({});

  const [expenseFilters, setExpenseFilters] = useState<{
    month?: string;
    year?: number;
    search?: string;
  }>({});

  // Data states
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [playerDeposits, setPlayerDeposits] = useState<PlayerDeposit[]>([]);
  const [memberDeposits, setMemberDeposits] = useState<MemberDeposit[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [playerNames, setPlayerNames] = useState<PlayerName[]>([]);
  const [memberNames, setMemberNames] = useState<MemberName[]>([]);

  // Total amounts state
  const [playerDepositsTotalAmount, setPlayerDepositsTotalAmount] = useState<number>(0);
  const [memberDepositsTotalAmount, setMemberDepositsTotalAmount] = useState<number>(0);
  const [donationsTotalAmount, setDonationsTotalAmount] = useState<number>(0);
  const [expensesTotalAmount, setExpensesTotalAmount] = useState<number>(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FormType>('member');
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const financialService = FinancialService.getInstance();

  // Currency formatter
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  // Load data when period/month/year changes
  useEffect(() => {
    if (period === 'monthly' && selectedMonth && selectedYear) {
      loadFinancialData('monthly');
    } else if (period === 'yearly' && selectedYear) {
      loadFinancialData('yearly');
    } else if (period === 'all') {
      loadFinancialData('all');
    }
  }, [period, selectedMonth, selectedYear]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadMembers(),
        loadPlayerNames(),
        loadMemberNames(),
        loadFinancialData()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialData = async (mode?: 'monthly' | 'yearly' | 'all') => {
    try {
      let reportData;

      // Determine base filters based on mode and selected month/year
      const currentMode = mode || period;
      const baseMonth = currentMode === 'monthly' ? selectedMonth : undefined;
      const baseYear = (currentMode === 'monthly' || currentMode === 'yearly') ? selectedYear : undefined;

      // Load report
      reportData = await financialService.getFinancialReport(baseMonth, baseYear);
      setFinancialReport(reportData);

      // Load sections with their specific filters combined with base filters (if applicable)
      // Note: The sections manage their own filters, so we should use those if set, 
      // OR default to the global dashboard filters if the section filters are empty/default.
      // However, the current design in PlayerDepositsSection uses local state for filters and calls onFilterChange.
      // Ideally, we should fetch data based on the specific filters for each section.

      await Promise.all([
        loadMemberDeposits(memberDepositFilters),
        loadDonations(donationFilters),
        loadExpenses(expenseFilters),
        loadPlayerDeposits(_playerDepositFilters)
      ]);

    } catch (err) {
      console.error('Error loading financial data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load financial data');
    }
  };

  const loadMembers = async () => {
    try {
      const membersData = await financialService.getMembers(1, 100);
      setMembers(membersData);
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  const loadPlayerNames = async () => {
    try {
      const playerNamesData = await financialService.getPlayerNames();
      setPlayerNames(playerNamesData);
    } catch (err) {
      console.error('Error loading player names:', err);
    }
  };

  const loadMemberNames = async () => {
    try {
      const memberNamesData = await financialService.getMemberNames();
      setMemberNames(memberNamesData);
    } catch (err) {
      console.error('Error loading member names:', err);
    }
  };

  const loadMemberDeposits = async (filters?: any) => {
    try {
      // If no specific filters, use global dashboard defaults
      const month = filters?.month || (period === 'monthly' ? selectedMonth : undefined);
      const year = filters?.year || ((period === 'monthly' || period === 'yearly') ? selectedYear : undefined);

      const data = await financialService.getMemberDeposits(1, 100, month, year, filters?.memberId, filters?.search);
      setMemberDeposits(data.items || []);
      setMemberDepositsTotalAmount(data.total_amount || 0);
    } catch (err) {
      console.error('Error loading member deposits:', err);
    }
  };

  const loadDonations = async (filters?: any) => {
    try {
      const month = filters?.month || (period === 'monthly' ? selectedMonth : undefined);
      const year = filters?.year || ((period === 'monthly' || period === 'yearly') ? selectedYear : undefined);

      const data = await financialService.getDonations(1, 100, month, year, filters?.search);
      setDonations(data.items || []);
      setDonationsTotalAmount(data.total_amount || 0);
    } catch (err) {
      console.error('Error loading donations:', err);
    }
  };

  const loadExpenses = async (filters?: any) => {
    try {
      const month = filters?.month || (period === 'monthly' ? selectedMonth : undefined);
      const year = filters?.year || ((period === 'monthly' || period === 'yearly') ? selectedYear : undefined);

      const data = await financialService.getExpenses(1, 100, month, year, filters?.search);
      setExpenses(data.items || []);
      setExpensesTotalAmount(data.total_amount || 0);
    } catch (err) {
      console.error('Error loading expenses:', err);
    }
  };

  const loadPlayerDeposits = async (filters?: {
    month?: string;
    year?: number;
    playerId?: number;
    search?: string;
  }) => {
    try {
      // If no specific filters, use global dashboard defaults
      const month = filters?.month || (period === 'monthly' ? selectedMonth : undefined);
      const year = filters?.year || ((period === 'monthly' || period === 'yearly') ? selectedYear : undefined);

      const playerDepositsData = await financialService.getPlayerDeposits(
        1,
        100,
        month,
        year,
        filters?.playerId,
        filters?.search
      );
      setPlayerDeposits(playerDepositsData.items || []);
      setPlayerDepositsTotalAmount(playerDepositsData.total_amount || 0);
    } catch (err) {
      console.error('Error loading player deposits:', err);
    }
  };

  const handlePlayerDepositFilterChange = (filters: any) => {
    setPlayerDepositFilters(filters);
    loadPlayerDeposits(filters);
  };

  const handleMemberDepositFilterChange = (filters: any) => {
    setMemberDepositFilters(filters);
    loadMemberDeposits(filters);
  };

  const handleDonationFilterChange = (filters: any) => {
    setDonationFilters(filters);
    loadDonations(filters);
  };

  const handleExpenseFilterChange = (filters: any) => {
    setExpenseFilters(filters);
    loadExpenses(filters);
  };

  // Modal handlers
  const openModal = (type: FormType, editData?: any) => {
    setModalType(type);
    setEditingItem(editData ? { type, data: editData } : null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // CRUD operations
  const handleDelete = async (type: FormType, id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      switch (type) {
        case 'member':
          await financialService.deleteMember(id);
          await loadMembers();
          await loadMemberNames();
          break;
        case 'player-deposit':
          await financialService.deletePlayerDeposit(id);
          await loadFinancialData();
          break;
        case 'member-deposit':
          await financialService.deleteMemberDeposit(id);
          await loadFinancialData();
          break;
        case 'donation':
          await financialService.deleteDonation(id);
          await loadFinancialData();
          break;
        case 'expense':
          await financialService.deleteExpense(id);
          await loadFinancialData();
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewSection
            financialReport={financialReport}
            memberNames={memberNames}
            formatCurrency={formatCurrency}
            period={period}
          />
        );

      case 'members':
        return (
          <MembersSection
            members={members}
            onAddNew={() => openModal('member')}
            onEdit={(member) => openModal('member', member)}
            onDelete={(id) => handleDelete('member', id)}
          />
        );

      case 'player-deposits':
        return (
          <PlayerDepositsSection
            playerDeposits={playerDeposits}
            onAddNew={() => openModal('player-deposit')}
            onEdit={(deposit) => openModal('player-deposit', deposit)}
            onDelete={(id) => handleDelete('player-deposit', id)}
            formatCurrency={formatCurrency}
            playerNames={playerNames}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onFilterChange={handlePlayerDepositFilterChange}
            totalAmount={playerDepositsTotalAmount}
          />
        );

      case 'member-deposits':
        return (
          <MemberDepositsSection
            memberDeposits={memberDeposits}
            onAddNew={() => openModal('member-deposit')}
            onEdit={(deposit) => openModal('member-deposit', deposit)}
            onDelete={(id) => handleDelete('member-deposit', id)}
            formatCurrency={formatCurrency}
            onFilterChange={handleMemberDepositFilterChange}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            memberNames={memberNames}
            totalAmount={memberDepositsTotalAmount}
          />
        );

      case 'donations':
        return (
          <DonationsSection
            donations={donations}
            onAddNew={() => openModal('donation')}
            onEdit={(donation) => openModal('donation', donation)}
            onDelete={(id) => handleDelete('donation', id)}
            formatCurrency={formatCurrency}
            onFilterChange={handleDonationFilterChange}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            totalAmount={donationsTotalAmount}
          />
        );

      case 'expenses':
        return (
          <ExpensesSection
            expenses={expenses}
            onAddNew={() => openModal('expense')}
            onEdit={(expense) => openModal('expense', expense)}
            onDelete={(id) => handleDelete('expense', id)}
            formatCurrency={formatCurrency}
            onFilterChange={handleExpenseFilterChange}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            totalAmount={expensesTotalAmount}
          />
        );

      default:
        return null;
    }
  };

  if (loading && !financialReport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FinancialDashboardHeader
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          period={period}
          onPeriodChange={setPeriod}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onRefresh={() => loadFinancialData()}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-800 hover:text-red-900 text-sm underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <FinancialDashboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-6">
            {renderActiveTab()}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <FinancialFormModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onSuccess={loadAllData}
            formType={modalType}
            editData={editingItem?.data}
            playerNames={playerNames}
            memberNames={memberNames}
          />
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;
