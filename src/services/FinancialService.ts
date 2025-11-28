import { AuthService } from "./AuthService";

// Types based on backend schemas
export interface Member {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface MemberCreate {
  name: string;
}

export interface PlayerDeposit {
  id: number;
  player_id: number;
  player_name?: string;
  player_registration_number?: string;
  month: string;
  year: number;
  amount: number;
  description?: string;
  deposit_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface PlayerDepositCreate {
  player_id: number;
  month: string;
  year: number;
  amount: number;
  description?: string;
  deposit_date?: string;
}

export interface MemberDeposit {
  id: number;
  member_id: number;
  member_name?: string;
  month: string;
  year: number;
  amount: number;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface MemberDepositCreate {
  member_id: number;
  month: string;
  year: number;
  amount: number;
  description?: string;
}

export interface Donation {
  id: number;
  donor_name: string;
  month: string;
  year: number;
  amount: number;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface DonationCreate {
  donor_name: string;
  month: string;
  year: number;
  amount: number;
  description?: string;
}

export interface Expense {
  id: number;
  category: string;
  month: string;
  year: number;
  amount: number;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface ExpenseCreate {
  category: string;
  month: string;
  year: number;
  amount: number;
  description?: string;
}

export interface ExpenseCategorySummary {
  category: string;
  amount: number;
}

export interface FinancialReport {
  month: string;
  year: number;
  expenses_by_category: ExpenseCategorySummary[];
  total_member_deposits: number;
  total_player_deposits: number;
  total_donations: number;
  total_income: number;
  total_expenses: number;
  monthly_balance: number;
}

export interface PlayerName {
  id: number;
  name: string;
  registration_number: string;
}

export interface MemberName {
  id: number;
  name: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
  total_amount?: number;
}

class FinancialService {
  private static instance: FinancialService;
  private baseURL: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;

  }

  public static getInstance(): FinancialService {
    if (!FinancialService.instance) {
      FinancialService.instance = new FinancialService();
    }
    return FinancialService.instance;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = AuthService.getInstance().getToken();

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Handle empty responses (like 204 No Content for DELETE requests)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    // For non-JSON responses or empty responses, return undefined
    return undefined as T;
  }

  // Member Management
  async getMembers(page: number = 1, size: number = 10, search?: string): Promise<Member[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search }),
    });
    return this.makeRequest<Member[]>(`/api/v1/financials/members/?${params}`);
  }

  async getMemberNames(): Promise<MemberName[]> {
    return this.makeRequest<MemberName[]>('/api/v1/financials/members/names/');
  }

  async createMember(memberData: MemberCreate): Promise<Member> {
    return this.makeRequest<Member>('/api/v1/financials/members/', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  }

  async updateMember(memberId: number, memberData: Partial<MemberCreate>): Promise<Member> {
    return this.makeRequest<Member>(`/api/v1/financials/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteMember(memberId: number): Promise<void> {
    await this.makeRequest<void>(`/api/v1/financials/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // Player Deposits
  async getPlayerDeposits(
    page: number = 1,
    size: number = 10,
    month?: string,
    year?: number,
    playerId?: number,
    search?: string
  ): Promise<PaginatedResponse<PlayerDeposit>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(month && { month }),
      ...(year && { year: year.toString() }),
      ...(playerId && { player_id: playerId.toString() }),
      ...(search && { search }),
    });
    return this.makeRequest<PaginatedResponse<PlayerDeposit>>(`/api/v1/financials/player_deposits/?${params}`);
  }

  async createPlayerDeposit(depositData: PlayerDepositCreate): Promise<PlayerDeposit> {
    return this.makeRequest<PlayerDeposit>('/api/v1/financials/player_deposits/', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  }

  async updatePlayerDeposit(depositId: number, depositData: Partial<PlayerDepositCreate>): Promise<PlayerDeposit> {
    return this.makeRequest<PlayerDeposit>(`/api/v1/financials/player_deposits/${depositId}`, {
      method: 'PUT',
      body: JSON.stringify(depositData),
    });
  }

  async deletePlayerDeposit(depositId: number): Promise<void> {
    await this.makeRequest<void>(`/api/v1/financials/player_deposits/${depositId}`, {
      method: 'DELETE',
    });
  }

  // Member Deposits
  async getMemberDeposits(
    page: number = 1,
    size: number = 10,
    month?: string,
    year?: number,
    memberId?: number,
    search?: string
  ): Promise<PaginatedResponse<MemberDeposit>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(month && { month }),
      ...(year && { year: year.toString() }),
      ...(memberId && { member_id: memberId.toString() }),
      ...(search && { search }),
    });
    return this.makeRequest<PaginatedResponse<MemberDeposit>>(`/api/v1/financials/member_deposits/?${params}`);
  }

  async createMemberDeposit(depositData: MemberDepositCreate): Promise<MemberDeposit> {
    return this.makeRequest<MemberDeposit>('/api/v1/financials/member_deposits/', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  }

  async updateMemberDeposit(depositId: number, depositData: Partial<MemberDepositCreate>): Promise<MemberDeposit> {
    return this.makeRequest<MemberDeposit>(`/api/v1/financials/member_deposits/${depositId}`, {
      method: 'PUT',
      body: JSON.stringify(depositData),
    });
  }

  async deleteMemberDeposit(depositId: number): Promise<void> {
    await this.makeRequest<void>(`/api/v1/financials/member_deposits/${depositId}`, {
      method: 'DELETE',
    });
  }

  // Donations
  async getDonations(
    page: number = 1,
    size: number = 10,
    month?: string,
    year?: number,
    search?: string
  ): Promise<PaginatedResponse<Donation>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(month && { month }),
      ...(year && { year: year.toString() }),
      ...(search && { search }),
    });
    return this.makeRequest<PaginatedResponse<Donation>>(`/api/v1/financials/donations/?${params}`);
  }

  async createDonation(donationData: DonationCreate): Promise<Donation> {
    return this.makeRequest<Donation>('/api/v1/financials/donations/', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async updateDonation(donationId: number, donationData: Partial<DonationCreate>): Promise<Donation> {
    return this.makeRequest<Donation>(`/api/v1/financials/donations/${donationId}`, {
      method: 'PUT',
      body: JSON.stringify(donationData),
    });
  }

  async deleteDonation(donationId: number): Promise<void> {
    await this.makeRequest<void>(`/api/v1/financials/donations/${donationId}`, {
      method: 'DELETE',
    });
  }

  // Expenses
  async getExpenses(
    page: number = 1,
    size: number = 10,
    month?: string,
    year?: number,
    search?: string
  ): Promise<PaginatedResponse<Expense>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(month && { month }),
      ...(year && { year: year.toString() }),
      ...(search && { search }),
    });
    return this.makeRequest<PaginatedResponse<Expense>>(`/api/v1/financials/expenses/?${params}`);
  }

  async createExpense(expenseData: ExpenseCreate): Promise<Expense> {
    return this.makeRequest<Expense>('/api/v1/financials/expenses/', {
      method: 'POST',
      body: JSON.stringify(expenseData),
    });
  }

  async updateExpense(expenseId: number, expenseData: Partial<ExpenseCreate>): Promise<Expense> {
    return this.makeRequest<Expense>(`/api/v1/financials/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  }

  async deleteExpense(expenseId: number): Promise<void> {
    await this.makeRequest<void>(`/api/v1/financials/expenses/${expenseId}`, {
      method: 'DELETE',
    });
  }

  // Financial Report
  async getFinancialReport(month?: string, year?: number): Promise<FinancialReport> {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year.toString());
    return this.makeRequest<FinancialReport>(`/api/v1/financials/report/?${params.toString()}`);
  }

  // Get player names for dropdowns
  async getPlayerNames(): Promise<PlayerName[]> {
    return this.makeRequest<PlayerName[]>('/api/v1/applications/names/');
  }
}

export default FinancialService;
