import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#0A0E27',
  accent: '#5B5FED',
  white: '#FFFFFF',
  gray: '#6B7280',
  success: '#00D9A8',
};

export default function ProfessionalProfileCard({ 
  user, 
  onLike, 
  onPass,
  style 
}) {
  return (
    <View style={[styles.card, style]}>
      {/* Profile Image */}
      <Image
        source={{ uri: user.photos?.[0] || 'https://via.placeholder.com/400' }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      {/* Verification Badge */}
      {user.isVerified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.white} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      )}

      {/* Profile Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          {user.isVerified && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          )}
        </View>

        {/* Professional Info */}
        <View style={styles.professionalInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="briefcase" size={16} color={COLORS.white} />
            <Text style={styles.infoText}>
              {user.jobTitle} at {user.company}
            </Text>
          </View>
          
          {user.education && (
            <View style={styles.infoRow}>
              <Ionicons name="school" size={16} color={COLORS.white} />
              <Text style={styles.infoText}>{user.education}</Text>
            </View>
          )}

          {user.industry && (
            <View style={styles.infoRow}>
              <Ionicons name="globe" size={16} color={COLORS.white} />
              <Text style={styles.infoText}>{user.industry}</Text>
            </View>
          )}
        </View>

        {/* Bio */}
        {user.bio && (
          <Text style={styles.bio} numberOfLines={3}>
            {user.bio}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={onPass}>
          <Ionicons name="close" size={32} color="#FF5A5F" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={onLike}>
          <LinearGradient
            colors={['#5B5FED', '#00D9A8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.likeGradient}
          >
            <Ionicons name="heart" size={32} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  professionalInfo: {
    marginBottom: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
    opacity: 0.9,
  },
  actions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  passButton: {
    backgroundColor: COLORS.white,
  },
  likeButton: {
    overflow: 'hidden',
  },
  likeGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
