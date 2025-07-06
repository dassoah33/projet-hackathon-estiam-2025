import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Card, Event } from '../types';

interface ProfileScreenProps {
  currentUser: User | null;
  currentCard: Card | null;
  events: Event[];
  onLogout: () => void;
}

export default function ProfileScreen({
  currentUser,
  currentCard,
  events,
  onLogout,
}: ProfileScreenProps) {
  // État pour gérer les erreurs de chargement d'image
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!currentUser) return 'U';
    const firstInitial = currentUser.firstname?.[0]?.toUpperCase() || '';
    const lastInitial = currentUser.lastname?.[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  // Fonction pour gérer l'erreur de chargement d'image
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Fonction pour gérer le chargement réussi de l'image
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Fonction pour gérer le début du chargement
  const handleImageLoadStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  // Vérifier si on a une URL d'avatar valide
  const hasValidAvatar = currentUser?.avatar && 
                        typeof currentUser.avatar === 'string' && 
                        currentUser.avatar.trim() !== '' &&
                        !imageError;

  // Composant Avatar avec gestion d'image et fallback
  const AvatarComponent = () => {
    if (hasValidAvatar) {
      return (
        <View style={styles.avatar}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatarImage}
            onError={handleImageError}
            onLoad={handleImageLoad}
            onLoadStart={handleImageLoadStart}
            resizeMode="cover"
          />
          {/* Overlay de chargement */}
          {imageLoading && (
            <View style={styles.avatarLoadingOverlay}>
              <Ionicons name="person-outline" size={24} color="#FFFFFF" />
            </View>
          )}
          {/* Overlay d'erreur si l'image ne charge pas */}
          {imageError && (
            <View style={styles.avatarErrorOverlay}>
              <Ionicons name="person-outline" size={24} color="#FFFFFF" />
            </View>
          )}
        </View>
      );
    }

    // Fallback avec initiales si pas d'image ou erreur
    return (
      <View style={[styles.avatar, styles.avatarFallback]}>
        <Text style={styles.avatarText}>
          {getUserInitials()}
        </Text>
      </View>
    );
  };

  // Fonction pour obtenir le titre de la carte selon le rôle
  const getCardTitle = () => {
    if (!currentUser?.role) return "Ma carte";
    return currentUser.role.toLowerCase() === 'etudiant' ? "Ma carte étudiante" : "Ma carte professeur";
  };

  // Fonction pour obtenir l'icône de la carte selon le rôle
  const getCardIcon = () => {
    if (!currentUser?.role) return "card-outline";
    return currentUser.role.toLowerCase() === 'etudiant' ? "school-outline" : "briefcase-outline";
  };

  const menuItems = [
    {
      title: getCardTitle(),
      subtitle: currentCard ? `${currentCard.num_carte} - ${currentCard.etat}` : "Aucune carte",
      icon: getCardIcon(),
    },
    {
      title: "Mes informations",
      subtitle: `${currentUser?.telephone || 'Pas de téléphone'}`,
      icon: "person-outline",
    },
    {
      title: "Ma classe",
      subtitle: currentUser?.classe?.nom || 'Classe non assignée',
      icon: "people-outline",
    },
    {
      title: "Ma filière", 
      subtitle: currentUser?.filiere?.nom || 'Filière non assignée',
      icon: "school-outline",
    },
    {
      title: "Changer la photo",
      subtitle: "Modifier votre photo de profil",
      icon: "camera-outline",
      onPress: () => {
        // TODO: Implémenter la fonctionnalité de changement de photo
        console.log('Changer la photo de profil');
      },
    },
    {
      title: "Paramètres",
      subtitle: "Notifications et préférences",
      icon: "settings-outline",
      onPress: () => {
        // TODO: Implémenter la page des paramètres
        console.log('Ouvrir les paramètres');
      },
    },
    {
      title: "Déconnexion",
      subtitle: "Se déconnecter de l'application",
      icon: "log-out-outline",
      onPress: onLogout,
      isDestructive: true,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        {/* Avatar avec gestion d'image */}
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => {
            // Possibilité d'agrandir l'avatar ou de le changer
            console.log('Avatar pressé');
          }}
          activeOpacity={0.8}
        >
          <AvatarComponent />
          {/* Badge pour indiquer qu'on peut changer la photo */}
          <View style={styles.avatarBadge}>
            <Ionicons name="camera" size={12} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Text style={styles.profileName}>
          {currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : 'Utilisateur'}
        </Text>
        <Text style={styles.profileEmail}>
          {currentUser?.email || 'email@estiam.edu'}
        </Text>
        <Text style={styles.profileClass}>
          {currentUser?.classe?.nom || 'Classe non définie'} - {currentUser?.filiere?.nom || 'Filière non définie'}
        </Text>
        
        {/* Badge de rôle */}
        <View style={[
          styles.roleBadge, 
          { backgroundColor: currentUser?.role?.toLowerCase() === 'etudiant' ? '#6366F1' : '#059669' }
        ]}>
          <Ionicons 
            name={currentUser?.role?.toLowerCase() === 'etudiant' ? 'school' : 'briefcase'} 
            size={12} 
            color="#FFFFFF" 
          />
          <Text style={styles.roleText}>
            {currentUser?.role?.toLowerCase() === 'etudiant' ? 'Étudiant' : 'Professeur'}
          </Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Informations</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentUser?.role || 'N/A'}</Text>
            <Text style={styles.statLabel}>Rôle</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#6366F1" }]}>
              {currentCard?.etat || 'N/A'}
            </Text>
            <Text style={styles.statLabel}>Statut carte</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#10B981" }]}>
              {events.length}
            </Text>
            <Text style={styles.statLabel}>Événements</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.menuItem,
              item.isDestructive && styles.menuItemDestructive
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons 
                name={item.icon as any} 
                size={24} 
                color={item.isDestructive ? "#EF4444" : "#6B7280"} 
              />
              <View style={styles.menuItemText}>
                <Text style={[
                  styles.menuItemTitle,
                  item.isDestructive && styles.menuItemTitleDestructive
                ]}>
                  {item.title}
                </Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={item.isDestructive ? "#EF4444" : "#6B7280"} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  avatarFallback: {
    backgroundColor: "#6366F1",
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(99, 102, 241, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  avatarErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemDestructive: {
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  menuItemTitleDestructive: {
    color: "#EF4444",
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});