import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, PieChart, BarChart3 } from 'lucide-react';
import { StatCard } from './StatCard';
import type { FinancialReport, MemberName } from '../../../services/FinancialService';

interface OverviewSectionProps {
  financialReport: FinancialReport | null;
  memberNames: MemberName[];
  formatCurrency: (amount: number) => string;
  period: 'monthly' | 'yearly' | 'all';
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  financialReport,
  memberNames,
  formatCurrency,
  period
}) => {
  // Helper to display period label
  const getPeriodLabel = () => {
    if (!financialReport) return '';
    if (period === 'all') return 'All Time';
    if (period === 'yearly') return `Year: ${financialReport.year || ''}`;
    if (period === 'monthly') return `${financialReport.month || ''} ${financialReport.year || ''}`;
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Period Label */}
      <div className="text-lg font-semibold text-blue-700 mb-2">{getPeriodLabel()}</div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Deposits"
          value={financialReport ? formatCurrency(financialReport.total_income) : '₹0'}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Expenses"
          value={financialReport ? formatCurrency(financialReport.total_expenses) : '₹0'}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="Net Balance"
          value={financialReport ? formatCurrency(financialReport.monthly_balance) : '₹0'}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color={financialReport && financialReport.monthly_balance >= 0 ? "bg-blue-500" : "bg-red-500"}
        />
        <StatCard
          title="Total Members"
          value={memberNames.length.toString()}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Income Breakdown */}
      {financialReport && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Income Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Deposits</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(financialReport.total_member_deposits)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Player Deposits</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(financialReport.total_player_deposits)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Donations</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(financialReport.total_donations)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-600" />
              Expenses by Category
            </h3>
            <div className="space-y-3">
              {financialReport.expenses_by_category && financialReport.expenses_by_category.length > 0 ? (
                financialReport.expenses_by_category.map((expense) => (
                  <div key={expense.category} className="flex justify-between items-center">
                    <span className="text-gray-600">{expense.category}</span>
                    <span className="font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No expenses recorded for this month</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
