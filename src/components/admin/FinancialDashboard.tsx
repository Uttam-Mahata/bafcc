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
  
  // Data states
  const [financialReport, setFinancialReport] = useState<FinancialReport | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [playerDeposits, setPlayerDeposits] = useState<PlayerDeposit[]>([]);
  const [memberDeposits, setMemberDeposits] = useState<MemberDeposit[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [playerNames, setPlayerNames] = useState<PlayerName[]>([]);
  const [memberNames, setMemberNames] = useState<MemberName[]>([]);
  
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
      let reportData, memberDepositsData, donationsData, expensesData;
      if ((mode || period) === 'monthly') {
        [reportData, memberDepositsData, donationsData, expensesData] = await Promise.all([
          financialService.getFinancialReport(selectedMonth, selectedYear),
          financialService.getMemberDeposits(1, 100, selectedMonth, selectedYear),
          financialService.getDonations(1, 100, selectedMonth, selectedYear),
          financialService.getExpenses(1, 100, selectedMonth, selectedYear)
        ]);
      } else if ((mode || period) === 'yearly') {
        [reportData, memberDepositsData, donationsData, expensesData] = await Promise.all([
          financialService.getFinancialReport(undefined, selectedYear),
          financialService.getMemberDeposits(1, 100, undefined, selectedYear),
          financialService.getDonations(1, 100, undefined, selectedYear),
          financialService.getExpenses(1, 100, undefined, selectedYear)
        ]);
      } else {
        [reportData, memberDepositsData, donationsData, expensesData] = await Promise.all([
          financialService.getFinancialReport(),
          financialService.getMemberDeposits(1, 100),
          financialService.getDonations(1, 100),
          financialService.getExpenses(1, 100)
        ]);
      }
      setFinancialReport(reportData);
      setMemberDeposits(memberDepositsData.items || []);
      setDonations(donationsData.items || []);
      setExpenses(expensesData.items || []);
      await loadPlayerDeposits();
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

  const loadPlayerDeposits = async (filters?: {
    month?: string;
    year?: number;
    playerId?: number;
    search?: string;
  }) => {
    try {
      const playerDepositsData = await financialService.getPlayerDeposits(
        1, 
        100, 
        filters?.month || selectedMonth, 
        filters?.year || selectedYear,
        filters?.playerId,
        filters?.search
      );
      setPlayerDeposits(playerDepositsData.items || []);
    } catch (err) {
      console.error('Error loading player deposits:', err);
    }
  };

  const handlePlayerDepositFilterChange = (filters: {
    month?: string;
    year?: number;
    playerId?: number;
    search?: string;
  }) => {
    setPlayerDepositFilters(filters);
    loadPlayerDeposits(filters);
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
