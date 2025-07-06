// App.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';

// Import des types
import { User, Card, Course, Event, AppTab } from './src/types';

// Import des services
import { authService } from './src/services/auth';
import { nfcService } from './src/services/nfc';

// Import des écrans
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import CoursesScreen from './src/screens/CoursesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';

// Import des composants
import Header from './src/components/Header';
import BottomNavigation from './src/components/BottomNavigation';
import CourseDetailModal from './src/components/CourseDetailModal';

export default function App() {
  // États principaux
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>("Dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // États utilisateur
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  
  // États des données
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // Configuration StatusBar native au démarrage
  useEffect(() => {
    initializeApp();
    
    // Garde la StatusBar visible mais configure les couleurs
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor("#FFFFFF", true);
      StatusBar.setBarStyle('dark-content', true);
    } else {
      StatusBar.setBarStyle('dark-content', true);
    }
  }, []);

  const initializeApp = async () => {
    try {
      await nfcService.initialize();
    } catch (error) {
      console.log('Erreur initialisation:', error);
    }
  };

  // Gestion de la connexion réussie
  const handleLoginSuccess = async (user: User, card?: Card) => {
    setCurrentUser(user);
    setCurrentCard(card || null);
    setIsAuthenticated(true);
    setActiveTab("Dashboard");
    
    // Charger les données utilisateur
    await loadUserData();
  };

  // Charger les données utilisateur (cours et événements)
  const loadUserData = async () => {
    setLoading(true);
    try {
      const { courses: userCourses, events: userEvents } = await authService.loadUserData();
      setCourses(userCourses);
      setEvents(userEvents);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la déconnexion
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: () => {
            // Reset de tous les états
            setIsAuthenticated(false);
            setCurrentUser(null);
            setCurrentCard(null);
            setCourses([]);
            setEvents([]);
            setSelectedCourse(null);
            setActiveTab("Dashboard");
          }
        }
      ]
    );
  };

  // Gestion de la sélection d'un cours
  const handleCoursePress = (course: Course) => {
    setSelectedCourse(course);
  };

  // Gestion du changement d'onglet
  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
  };

  // Rendu du contenu selon l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardScreen
            currentUser={currentUser}
            currentCard={currentCard}
            courses={courses}
            onCoursePress={handleCoursePress}
          />
        );
      case "Messages":
        return (
          <MessagesScreen
            currentUser={currentUser}
          />
        );
      case "Courses":
        return (
          <CoursesScreen
            currentUser={currentUser}
            courses={courses}
            onCoursePress={handleCoursePress}
          />
        );
      case "Documents":
        return (
          <DocumentsScreen
            currentUser={currentUser}
          />
        );
      case "Profile":
        return (
          <ProfileScreen
            currentUser={currentUser}
            currentCard={currentCard}
            events={events}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <DashboardScreen
            currentUser={currentUser}
            currentCard={currentCard}
            courses={courses}
            onCoursePress={handleCoursePress}
          />
        );
    }
  };

  // Si pas authentifié, afficher l'écran de connexion
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        {/* Espaceur pour l'écran de connexion aussi */}
        <View style={styles.statusBarSpacer} />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </View>
    );
  }

  // Application principale
  return (
    <View style={styles.container}>
      {/* Espaceur pour éviter que le contenu colle à la barre système */}
      <View style={styles.statusBarSpacer} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Header onLogout={handleLogout} />

        {/* Contenu principal */}
        <View style={styles.content}>
          {renderContent()}
        </View>

        {/* Navigation par onglets */}
        <BottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabChange}
        />

        {/* Modal détail du cours */}
        <CourseDetailModal
          course={selectedCourse}
          visible={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? 25 : 0, // Espaceur pour Android
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});