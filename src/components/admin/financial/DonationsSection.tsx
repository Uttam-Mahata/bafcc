import React from 'react';
import { TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import type { Donation } from '../../../services/FinancialService';
import { StatCard } from './StatCard';
import { BarChart3 } from 'lucide-react';
import { MONTHS } from './constants';

interface DonationsSectionProps {
  donations: Donation[];
  onAddNew: () => void;
  onEdit: (donation: Donation) => void;
  onDelete: (id: number) => void;
  formatCurrency: (amount: number) => string;
}

export const DonationsSection: React.FC<DonationsSectionProps> = ({
  donations,
  onAddNew,
  onEdit,
  onDelete,
  formatCurrency
}) => {
  const [period, setPeriod] = React.useState<'monthly' | 'yearly' | 'all'>('monthly');
  const [filterMonth, setFilterMonth] = React.useState(MONTHS[new Date().getMonth()]);
  const [filterYear, setFilterYear] = React.useState(new Date().getFullYear());

  // Summary stats
  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalCount = donations.length;

  // Handle period change
  const handlePeriodChange = (newPeriod: 'monthly' | 'yearly' | 'all') => {
    setPeriod(newPeriod);
    // TODO: Call parent onFilterChange if you want to fetch data from parent
  };
  const handleMonthFilter = (month: string) => {
    setFilterMonth(month);
    // TODO: Call parent onFilterChange if you want to fetch data from parent
  };
  const handleYearFilter = (year: number) => {
    setFilterYear(year);
    // TODO: Call parent onFilterChange if you want to fetch data from parent
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Donations
        </h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Donation
        </button>
      </div>

      {/* Period Dropdown and Summary */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Period:</label>
          <select
            value={period}
            onChange={e => handlePeriodChange(e.target.value as 'monthly' | 'yearly' | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="all">All Time</option>
          </select>
          {period === 'monthly' && (
            <select
              value={filterMonth}
              onChange={e => handleMonthFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          )}
          {(period === 'monthly' || period === 'yearly') && (
            <input
              type="number"
              value={filterYear}
              onChange={e => handleYearFilter(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="2020"
              max="2030"
            />
          )}
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <StatCard
            title="Total Amount"
            value={formatCurrency(totalAmount)}
            icon={<BarChart3 className="w-5 h-5 text-white" />}
            color="bg-green-500"
          />
          <StatCard
            title="Total Donations"
            value={totalCount.toString()}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            color="bg-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donation.donor_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-green-600">{formatCurrency(donation.amount)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{donation.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(donation)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(donation.id)}
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
