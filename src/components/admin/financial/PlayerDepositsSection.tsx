import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Edit, Trash2, Search, Filter, BarChart3 } from 'lucide-react';
import type { PlayerDeposit, PlayerName } from '../../../services/FinancialService';
import { MONTHS } from './constants';
import { StatCard } from './StatCard';

interface PlayerDepositsSectionProps {
  playerDeposits: PlayerDeposit[];
  onAddNew: () => void;
  onEdit: (deposit: PlayerDeposit) => void;
  onDelete: (id: number) => void;
  formatCurrency: (amount: number) => string;
  playerNames: PlayerName[];
  selectedMonth: string;
  selectedYear: number;
  onFilterChange: (filters: { month?: string; year?: number; playerId?: number; search?: string }) => void;
  totalAmount: number;
}

export const PlayerDepositsSection: React.FC<PlayerDepositsSectionProps> = ({
  playerDeposits,
  onAddNew,
  onEdit,
  onDelete,
  formatCurrency,
  playerNames,
  selectedMonth,
  selectedYear,
  onFilterChange,
  totalAmount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>();
  const [filterMonth, setFilterMonth] = useState(selectedMonth);
  const [filterYear, setFilterYear] = useState(selectedYear);

  // Summary stats
  // const totalAmount is now passed as prop
  const totalCount = playerDeposits.length; // Note: This is count of current page items, ideally should be total count from API too

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Trigger filter change when any filter changes
  useEffect(() => {
    onFilterChange({
      month: filterMonth || undefined,
      year: filterYear,
      playerId: selectedPlayerId,
      search: debouncedSearchTerm || undefined
    });
  }, [debouncedSearchTerm, selectedPlayerId, filterMonth, filterYear]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Player Deposits
        </h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Deposit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Amount"
          value={formatCurrency(totalAmount)}
          icon={<BarChart3 className="w-5 h-5 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Deposits"
          value={totalCount.toString()}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          color="bg-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters & Search</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, reg. no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Player Filter */}
          <select
            value={selectedPlayerId || ''}
            onChange={(e) => setSelectedPlayerId(e.target.value ? parseInt(e.target.value) : undefined)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Players</option>
            {playerNames.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.registration_number})
              </option>
            ))}
          </select>

          {/* Month Filter */}
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Months</option>
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <input
            type="number"
            placeholder="Year"
            value={filterYear || ''}
            onChange={(e) => setFilterYear(parseInt(e.target.value) || new Date().getFullYear())}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="2020"
            max="2030"
          />

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedPlayerId(undefined);
              setFilterMonth('');
              setFilterYear(new Date().getFullYear());
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deposit Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {playerDeposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{deposit.player_name || `Player ${deposit.player_id}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">{deposit.player_registration_number || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">{formatCurrency(deposit.amount)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(deposit.deposit_date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{deposit.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(deposit)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(deposit.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
