// Types pour l'application ESTIAM Card

export interface Course {
  id: number;
  nom: string;
  code_matiere?: string;
  date: string;
  time: string;
  lieu: string;
  type: string;
  status: "active" | "upcoming" | "completed";
  credits: string;
  icon: string;
  professeur?: string;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone?: string;
  role: string;
  avatar?: string; // ← CHAMP AVATAR POUR LA PHOTO DE PROFIL
  classe?: {
    id: number;
    nom: string;
    niveau: string;
  };
  filiere?: {
    id: number;
    nom: string;
  };
}

export interface Event {
  id: number;
  nom: string;
  description: string;
  image?: string;
  lieu: string;
  date_debut: string;
  date_fin: string;
}

export interface Card {
  id: number;
  num_carte: string;
  token: string;
  etat: string;
  date_activation?: string;
  date_expiration?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  carte?: Card;
  error?: string;
}

export interface EventsResponse {
  success: boolean;
  evenements: Event[];
  error?: string;
}

// Types de navigation
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  CourseDetail: { course: Course };
};

export type TabParamList = {
  Dashboard: undefined;
  Messages: undefined; // ← REMPLACE Scan
  Courses: undefined;
  Documents: undefined;
  Profile: undefined;
};

export type AppTab = keyof TabParamList;

// Types utilitaires
export type CourseStatus = Course['status'];
export type UserRole = User['role'];
export type CardState = Card['etat'];