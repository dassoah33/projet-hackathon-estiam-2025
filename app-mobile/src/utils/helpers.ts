import { CourseStatus } from '../types';

// Utilitaires pour les couleurs et statuts
export const getStatusColor = (status: CourseStatus): string => {
  switch (status) {
    case "active":
      return "#10B981";
    case "upcoming":
      return "#6366F1";
    case "completed":
      return "#9CA3AF";
    default:
      return "#9CA3AF";
  }
};

export const getStatusText = (status: CourseStatus): string => {
  switch (status) {
    case "active":
      return "En cours";
    case "upcoming":
      return "À venir";
    case "completed":
      return "Terminé";
    default:
      return status;
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case "Cours":
      return "#6366F1";
    case "TP":
      return "#10B981";
    case "TD":
      return "#F59E0B";
    case "Projet":
      return "#EC4899";
    case "Examen":
      return "#EF4444";
    case "Événement":
      return "#8B5CF6";
    default:
      return "#9CA3AF";
  }
};

// Formatage des dates
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Génération d'initiales pour les avatars
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

// Masquage des numéros de carte
export const maskCardNumber = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 4) return cardNumber;
  return `•••• ${cardNumber.slice(-4)}`;
};

// Validation d'email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Génération de couleurs aléatoires pour les avatars
export const getAvatarColor = (name: string): string => {
  const colors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
    '#F59E0B', '#10B981', '#06B6D4', '#84CC16'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Calcul de statistiques
export const calculateStats = (courses: any[]) => {
  return {
    upcoming: courses.filter(c => c.status === "upcoming").length,
    active: courses.filter(c => c.status === "active").length,
    completed: courses.filter(c => c.status === "completed").length,
    total: courses.length
  };
};
