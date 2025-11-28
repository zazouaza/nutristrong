
import { ComprehensivePlan, UserProfile } from '../types';

// Use VITE_ prefix for Vite environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle non-JSON responses (like 404 HTML pages from proxies)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`API returned non-JSON response: ${response.status} ${response.statusText}`);
      }

      const result: ApiResponse<T> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Request failed with status ${response.status}`);
      }

      return result.data as T;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error(`CONNECTION ERROR: Could not connect to backend at ${API_URL}${endpoint}. \n\n1. Ensure the backend is running (npm run dev in backend folder).\n2. Ensure it is listening on port 3001.`);
        throw new Error("Cannot connect to server. Is the backend running on port 3001?");
      } else {
        console.error(`API Request Failed: ${endpoint}`, error);
      }
      throw error;
    }
  }

  // AI Generation
  async generatePlan(profile: UserProfile): Promise<ComprehensivePlan> {
    return this.request<ComprehensivePlan>('/ai/generate-plan', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // Save Profile & Plan (Authenticated)
  async saveProfilePlan(profile: UserProfile, plan: ComprehensivePlan) {
    return this.request('/profile/save-plan', {
      method: 'POST',
      body: JSON.stringify({
        ...profile,
        plan_json: plan
      })
    });
  }

  // Get Profile
  async getProfile(): Promise<UserProfile & { plan_json?: ComprehensivePlan }> {
    try {
      return await this.request('/profile/me');
    } catch (e) {
      console.error("Error fetching profile:", e);
      throw e;
    }
  }

  // Meals
  async getMealPlan(day: string) {
    return this.request(`/meals/${day}`);
  }

  async saveMealPlan(day: string, meals: any) {
    return this.request('/meals/save', {
      method: 'POST',
      body: JSON.stringify({ day, meals }),
    });
  }

  // Progress
  async logWeight(weight: number) {
    return this.request('/progress/weight', {
      method: 'POST',
      body: JSON.stringify({ weight }),
    });
  }

  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // Custom fetch for multipart to avoid Content-Type: json
    const response = await fetch(`${API_URL}/progress/photo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    return response.json();
  }
}

export const api = new ApiClient();