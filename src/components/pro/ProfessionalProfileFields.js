import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#0A0E27',
  accent: '#5B5FED',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray600: '#4B5563',
  text: '#0A0E27',
  textSecondary: '#6B7280',
};

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Engineering',
  'Law',
  'Consulting',
  'Real Estate',
  'Media',
  'Other',
];

const EDUCATION_LEVELS = [
  'High School',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'MBA',
  'PhD',
  'Professional Degree (MD, JD, etc)',
];

export default function ProfessionalProfileFields({ 
  jobTitle, 
  setJobTitle,
  company,
  setCompany,
  industry,
  setIndustry,
  education,
  setEducation,
}) {
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);

  return (
    <View style={styles.container}>
      {/* Job Title */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Job Title *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="briefcase-outline" size={20} color={COLORS.gray400} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Senior Software Engineer"
            value={jobTitle}
            onChangeText={setJobTitle}
            placeholderTextColor={COLORS.gray400}
          />
        </View>
      </View>

      {/* Company */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Company *</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="business-outline" size={20} color={COLORS.gray400} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Google, Microsoft, etc"
            value={company}
            onChangeText={setCompany}
            placeholderTextColor={COLORS.gray400}
          />
        </View>
      </View>

      {/* Industry */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Industry *</Text>
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => setShowIndustryPicker(true)}
        >
          <Ionicons name="globe-outline" size={20} color={COLORS.gray400} />
          <Text style={[styles.selectText, !industry && styles.placeholder]}>
            {industry || 'Select your industry'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.gray400} />
        </TouchableOpacity>
      </View>

      {/* Education */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Education Level *</Text>
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() => setShowEducationPicker(true)}
        >
          <Ionicons name="school-outline" size={20} color={COLORS.gray400} />
          <Text style={[styles.selectText, !education && styles.placeholder]}>
            {education || 'Select education level'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.gray400} />
        </TouchableOpacity>
      </View>

      {/* Verification Badge Info */}
      <View style={styles.verificationInfo}>
        <Ionicons name="shield-checkmark" size={24} color={COLORS.accent} />
        <View style={styles.verificationText}>
          <Text style={styles.verificationTitle}>LinkedIn Verification</Text>
          <Text style={styles.verificationDescription}>
            We'll verify your professional information to ensure quality matches
          </Text>
        </View>
      </View>

      {/* Industry Picker Modal */}
      <Modal
        visible={showIndustryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIndustryPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Industry</Text>
              <TouchableOpacity onPress={() => setShowIndustryPicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {INDUSTRIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    setIndustry(item);
                    setShowIndustryPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {industry === item && (
                    <Ionicons name="checkmark" size={24} color={COLORS.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Education Picker Modal */}
      <Modal
        visible={showEducationPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEducationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Education Level</Text>
              <TouchableOpacity onPress={() => setShowEducationPicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {EDUCATION_LEVELS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    setEducation(item);
                    setShowEducationPicker(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {education === item && (
                    <Ionicons name="checkmark" size={24} color={COLORS.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  placeholder: {
    color: COLORS.gray400,
  },
  verificationInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  verificationText: {
    flex: 1,
    marginLeft: 12,
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  verificationDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
