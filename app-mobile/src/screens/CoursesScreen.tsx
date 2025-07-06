import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, Course } from '../types';
import { getStatusColor, getStatusText, getTypeColor } from '../utils/helpers';

const { width } = Dimensions.get('window');

interface CoursesScreenProps {
  currentUser: User | null;
  courses: Course[];
  onCoursePress: (course: Course) => void;
}

export default function CoursesScreen({
  currentUser,
  courses,
  onCoursePress,
}: CoursesScreenProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Tous mes événements</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>Cette semaine</Text>
        {courses.length > 0 ? courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => onCoursePress(course)}
          >
            <View style={styles.courseContent}>
              <View style={styles.courseIcon}>
                <Ionicons name={course.icon as any} size={24} color="#6366F1" />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.nom}</Text>
                <Text style={styles.courseCode}>{course.code_matiere}</Text>
                <Text style={styles.courseTime}>
                  {course.date} • {course.time}
                </Text>
                <Text style={styles.courseVenue}>{course.lieu}</Text>
                {course.professeur && (
                  <Text style={styles.courseProfessor}>{course.professeur}</Text>
                )}
              </View>
              <View style={styles.courseRight}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeColor(course.type) },
                  ]}
                >
                  <Text style={styles.typeText}>{course.type}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(course.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(course.status)}
                  </Text>
                </View>
                <Text style={styles.courseCredits}>{course.credits}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )) : (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>Aucun événement disponible</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subsectionTitle}>Filière</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity
            style={[
              styles.categoryItem,
              { backgroundColor: `#6366F115` },
            ]}
          >
            <Ionicons
              name="school-outline"
              size={24}
              color="#6366F1"
            />
            <Text style={[styles.categoryText, { color: "#6366F1" }]}>
              {currentUser?.filiere?.nom || 'Ma filière'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  filterButton: {
    backgroundColor: "#6366F1",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  courseCard: {
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
  courseContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 12,
    color: "#6366F1",
    marginBottom: 2,
    fontWeight: "600",
  },
  courseTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  courseVenue: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  courseProfessor: {
    fontSize: 12,
    color: "#374151",
    fontStyle: "italic",
  },
  courseRight: {
    alignItems: "flex-end",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  courseCredits: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  categoryItem: {
    width: (width - 64) / 2,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
});