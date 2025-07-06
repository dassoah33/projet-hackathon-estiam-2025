import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../types';
import { getStatusColor, getStatusText, getTypeColor } from '../utils/helpers';

interface CourseDetailModalProps {
  course: Course | null;
  visible: boolean;
  onClose: () => void;
}

export default function CourseDetailModal({ 
  course, 
  visible, 
  onClose 
}: CourseDetailModalProps) {
  if (!course) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeaderGradient}>
            <View style={styles.modalHeaderContent}>
              <View>
                <Text style={styles.modalTitleWhite}>{course.nom}</Text>
                <Text style={styles.modalSubtitleWhite}>{course.code_matiere}</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.courseDetailCard}>
              <View style={styles.courseDetailIconSection}>
                <View style={styles.courseDetailIconContainer}>
                  <Ionicons
                    name={course.icon as any}
                    size={32}
                    color="#6366F1"
                  />
                </View>
                <View style={styles.courseBadgesContainer}>
                  <View
                    style={[
                      styles.typeBadgeLarge,
                      { backgroundColor: getTypeColor(course.type) },
                    ]}
                  >
                    <Text style={styles.typeBadgeText}>{course.type}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadgeLarge,
                      {
                        backgroundColor: getStatusColor(course.status),
                      },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {getStatusText(course.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.courseDetailsGrid}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={20} color="#6366F1" />
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{course.date}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={20} color="#6366F1" />
                  <Text style={styles.detailLabel}>Heure</Text>
                  <Text style={styles.detailValue}>{course.time}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={20} color="#6366F1" />
                  <Text style={styles.detailLabel}>Lieu</Text>
                  <Text style={styles.detailValue}>{course.lieu}</Text>
                </View>
                
                {course.professeur && (
                  <View style={styles.detailItem}>
                    <Ionicons name="person-outline" size={20} color="#6366F1" />
                    <Text style={styles.detailLabel}>Organisateur</Text>
                    <Text style={styles.detailValue}>{course.professeur}</Text>
                  </View>
                )}
                
                <View style={styles.detailItem}>
                  <Ionicons name="school-outline" size={20} color="#6366F1" />
                  <Text style={styles.detailLabel}>Crédits</Text>
                  <Text style={styles.detailValue}>{course.credits}</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.primaryButtonLarge}>
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text style={styles.primaryButtonTextLarge}>
                  Ajouter au calendrier
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButtonLarge}>
                <Ionicons name="share-outline" size={20} color="#6366F1" />
                <Text style={styles.secondaryButtonTextLarge}>
                  Partager
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: "100%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeaderGradient: {
    backgroundColor: "#6366F1",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  modalHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalTitleWhite: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  modalSubtitleWhite: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  closeButton: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 24,
  },
  courseDetailCard: {
    marginBottom: 24,
  },
  courseDetailIconSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  courseDetailIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  courseBadgesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  courseDetailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    flex: 2,
    textAlign: "right",
  },
  modalButtons: {
    marginTop: 24,
    gap: 12,
  },
  primaryButtonLarge: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonTextLarge: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonLarge: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryButtonTextLarge: {
    color: "#6366F1",
    fontSize: 16,
    fontWeight: "600",
  },
});
