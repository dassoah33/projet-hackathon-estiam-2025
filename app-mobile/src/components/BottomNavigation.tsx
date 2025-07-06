// BottomNavigation.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTab } from '../types';

interface BottomNavigationProps {
  activeTab: AppTab;
  onTabPress: (tab: AppTab) => void;
}

// TABLEAU CORRIGÉ : Scanner remplacé par Messages
const tabs = [
  { id: "Dashboard", icon: "grid-outline", label: "Accueil" },
  { id: "Messages", icon: "chatbubble-outline", label: "Messages" }, // ← MESSAGES AU LIEU DE SCANNER
  { id: "Courses", icon: "book-outline", label: "Événements" }, 
  { id: "Documents", icon: "document-text-outline", label: "Documents" },
  { id: "Profile", icon: "person-outline", label: "Profil" },
] as const;

export default function BottomNavigation({ activeTab, onTabPress }: BottomNavigationProps) {
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tabButton,
            activeTab === tab.id && styles.tabButtonActive,
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          <Ionicons
            name={tab.icon as any}
            size={20}
            color={activeTab === tab.id ? "#6366F1" : "#6B7280"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.tabLabelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4, // Réduit pour 5 onglets
    borderRadius: 8,
    marginHorizontal: 2, // Réduit pour 5 onglets
  },
  tabButtonActive: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  tabLabel: {
    fontSize: 11, // Légèrement réduit pour 5 onglets
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  tabLabelActive: {
    color: "#6366F1",
    fontWeight: "600",
  },
});