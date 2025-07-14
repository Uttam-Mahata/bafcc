import React from 'react';
import { ArrowLeft, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MONTHS } from './types';

interface FinancialDashboardHeaderProps {
  selectedMonth: string;
  selectedYear: number;
  period: 'monthly' | 'yearly' | 'all';
  onPeriodChange: (period: 'monthly' | 'yearly' | 'all') => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
  onRefresh: () => void;
}

export const FinancialDashboardHeader: React.FC<FinancialDashboardHeaderProps> = ({
  selectedMonth,
  selectedYear,
  period,
  onPeriodChange,
  onMonthChange,
  onYearChange,
  onRefresh
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="border-l border-gray-300 pl-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-7 h-7 text-blue-600" />
              Financial Management
            </h1>
            <p className="text-gray-600 mt-1">Track deposits, expenses, and financial reports</p>
          </div>
        </div>

        {/* Period/Month/Year Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={period}
              onChange={e => onPeriodChange(e.target.value as 'monthly' | 'yearly' | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="all">All Time</option>
            </select>
            {period === 'monthly' && (
              <select
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            )}
            {(period === 'monthly' || period === 'yearly') && (
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="2020"
                max="2030"
              />
            )}
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
