import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshResponse {
  access_token: string;
  token_type: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
}

export class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {
    // Initialize tokens from localStorage
    this.accessToken = localStorage.getItem('bafcc_access_token');
    this.refreshToken = localStorage.getItem('bafcc_refresh_token');
    
    // Set up axios interceptors for automatic token refresh
    this.setupAxiosInterceptors();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setupAxiosInterceptors(): void {
    // Request interceptor to add auth header
    axios.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.url?.includes(API_URL)) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newAccessToken = await this.refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.logout();
            window.location.href = '/admin/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post<LoginResponse>(`${API_URL}/api/v1/users/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token && response.data.refresh_token) {
      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      
      // Store tokens in localStorage
      localStorage.setItem('bafcc_access_token', response.data.access_token);
      localStorage.setItem('bafcc_refresh_token', response.data.refresh_token);
    }

    return response.data;
  }

  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    try {
      const response = await axios.post<RefreshResponse>(`${API_URL}/api/v1/users/refresh`, {
        refresh_token: this.refreshToken
      });

      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        localStorage.setItem('bafcc_access_token', response.data.access_token);
        return response.data.access_token;
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (error) {
      // Clear invalid refresh token
      this.refreshToken = null;
      localStorage.removeItem('bafcc_refresh_token');
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to revoke refresh token
      if (this.accessToken) {
        await axios.post(`${API_URL}/api/v1/users/logout`, {}, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });
      }
    } catch (error) {
      // Even if logout request fails, clear local tokens
      console.error('Logout request failed:', error);
    } finally {
      // Clear tokens from memory and localStorage
      this.accessToken = null;
      this.refreshToken = null;
      this.refreshPromise = null;
      localStorage.removeItem('bafcc_access_token');
      localStorage.removeItem('bafcc_refresh_token');
    }
  }

  async getCurrentUser(): Promise<UserInfo | null> {
    try {
      if (!this.accessToken) {
        return null;
      }

      const response = await axios.get<UserInfo>(`${API_URL}/api/v1/users/me`);
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  getToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Check if token is likely expired (without making a request)
  isTokenLikelyExpired(): boolean {
    if (!this.accessToken) return true;
    
    try {
      // Decode JWT payload (without verification)
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      
      // Consider token expired if it expires within the next 5 minutes
      return expirationTime <= currentTime + (5 * 60 * 1000);
    } catch (error) {
      // If we can't decode the token, consider it expired
      return true;
    }
  }
} 