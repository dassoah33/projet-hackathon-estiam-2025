import { Alert } from 'react-native';
import { User, Card, Course, Event } from '../types';
import apiService from './api';
import nfcService from './nfc';

class AuthService {
  // Authentification par email et mot de passe
  async loginWithCredentials(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    card?: Card;
    error?: string;
  }> {
    try {
      if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const response = await apiService.loginWithCredentials(email, password);

      if (response.success) {
        return {
          success: true,
          user: response.user,
          card: response.carte
        };
      } else {
        throw new Error(response.error || "Erreur de connexion");
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erreur de connexion"
      };
    }
  }

  // Authentification par NFC
  async loginWithNFC(): Promise<{
    success: boolean;
    user?: User;
    card?: Card;
    error?: string;
  }> {
    try {
      // Scanner la carte NFC
      const token = await nfcService.scanCard();
      
      // Authentifier avec le token
      const response = await apiService.loginWithNFC(token);
      
      if (response.success) {
        return {
          success: true,
          user: response.user,
          card: response.carte
        };
      } else {
        throw new Error(response.error || 'Erreur de connexion');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Erreur de lecture NFC"
      };
    }
  }

  // Charger les données utilisateur (événements, cours)
  async loadUserData(): Promise<{
    courses: Course[];
    events: Event[];
  }> {
    try {
      // Charger les événements
      const eventsResponse = await apiService.getUpcomingEvents();
      
      if (eventsResponse.success) {
        const events = eventsResponse.evenements;
        
        // Convertir les événements en format Course pour l'affichage
        const courses = events.map((event: Event) => ({
          id: event.id,
          nom: event.nom,
          code_matiere: `EVENT${event.id}`,
          date: new Date(event.date_debut).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          time: new Date(event.date_debut).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          lieu: event.lieu,
          type: "Événement",
          status: this.getEventStatus(event.date_debut),
          credits: "0 ECTS",
          icon: "calendar-outline",
          professeur: "Organisation"
        })) as Course[];
        
        return { courses, events };
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }

    // En cas d'erreur, retourner des données par défaut
    return this.getDefaultData();
  }

  // Déterminer le statut d'un événement
  private getEventStatus(dateDebut: string): "active" | "upcoming" | "completed" {
    const eventDate = new Date(dateDebut);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (eventDay.getTime() === today.getTime()) {
      return "active";
    } else if (eventDate > now) {
      return "upcoming";
    } else {
      return "completed";
    }
  }

  // Données par défaut en cas d'erreur API
  private getDefaultData(): { courses: Course[]; events: Event[] } {
    const defaultEvents: Event[] = [
      {
        id: 1,
        nom: "Hackathon ESTIAM 2025",
        description: "Concours de développement sur 48h",
        lieu: "Campus principal",
        date_debut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        date_fin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        nom: "Conférence IA & Machine Learning",
        description: "Tendances 2025 en intelligence artificielle",
        lieu: "Amphithéâtre A",
        date_debut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        date_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      }
    ];
    
    const defaultCourses: Course[] = defaultEvents.map((event) => ({
      id: event.id,
      nom: event.nom,
      code_matiere: `EVENT${event.id}`,
      date: new Date(event.date_debut).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: new Date(event.date_debut).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      lieu: event.lieu,
      type: "Événement",
      status: "upcoming",
      credits: "0 ECTS",
      icon: "calendar-outline",
      professeur: "Organisation"
    }));

    return { courses: defaultCourses, events: defaultEvents };
  }
}

export const authService = new AuthService();
export default authService;