import { AuthResponse, EventsResponse } from '../types';

// Configuration API
const API_BASE_URL = "https://apimycampus.odyzia.com/api";

class ApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      console.log(`Appel API: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      console.log(`Réponse API status: ${response.status}`);
      
      // Vérifier le content-type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log('Réponse non-JSON:', textResponse);
        throw new Error('Réponse API invalide (non-JSON)');
      }
      
      const data = await response.json();
      console.log('Données reçues:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur API complète:', error);
      throw error;
    }
  }

  // Authentification par email/password
  async loginWithCredentials(email: string, password: string): Promise<AuthResponse> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Authentification par NFC
  async loginWithNFC(token: string): Promise<AuthResponse> {
    return this.makeRequest('/auth/login-nfc', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Récupérer les événements à venir
  async getUpcomingEvents(): Promise<EventsResponse> {
    return this.makeRequest('/upcoming-events');
  }

  // Récupérer les informations utilisateur
  async getUserProfile(userId: number): Promise<any> {
    return this.makeRequest(`/users/${userId}`);
  }

  // Mettre à jour le profil utilisateur
  async updateUserProfile(userId: number, data: Partial<any>): Promise<any> {
    return this.makeRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService;