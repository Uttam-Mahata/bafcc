import React from 'react';
import { BarChart3, Users, TrendingUp, DollarSign, TrendingDown } from 'lucide-react';
import { TabButton } from './TabButton';
import type { ActiveTab } from './types';

interface FinancialDashboardTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const FinancialDashboardTabs: React.FC<FinancialDashboardTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100 p-4">
      <TabButton
        label="Overview"
        isActive={activeTab === 'overview'}
        onClick={() => onTabChange('overview')}
        icon={<BarChart3 className="w-4 h-4" />}
      />
      <TabButton
        label="Members"
        isActive={activeTab === 'members'}
        onClick={() => onTabChange('members')}
        icon={<Users className="w-4 h-4" />}
      />
      <TabButton
        label="Player Deposits"
        isActive={activeTab === 'player-deposits'}
        onClick={() => onTabChange('player-deposits')}
        icon={<TrendingUp className="w-4 h-4" />}
      />
      <TabButton
        label="Member Deposits"
        isActive={activeTab === 'member-deposits'}
        onClick={() => onTabChange('member-deposits')}
        icon={<DollarSign className="w-4 h-4" />}
      />
      <TabButton
        label="Donations"
        isActive={activeTab === 'donations'}
        onClick={() => onTabChange('donations')}
        icon={<TrendingUp className="w-4 h-4" />}
      />
      <TabButton
        label="Expenses"
        isActive={activeTab === 'expenses'}
        onClick={() => onTabChange('expenses')}
        icon={<TrendingDown className="w-4 h-4" />}
      />
    </div>
  );
};
