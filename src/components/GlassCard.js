import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

export default function GlassCard({ 
  icon, 
  title, 
  badge, 
  children,
  style,
  contentStyle 
}) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={theme.gradients.glass}
        style={styles.gradient}
      >
        {(icon || title || badge) && (
          <View style={styles.header}>
            <View style={styles.titleRow}>
              {icon && <Text style={styles.icon}>{icon}</Text>}
              {title && <Text style={styles.title}>{title}</Text>}
            </View>
            {badge !== undefined && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
        )}
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  gradient: {
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  title: {
    ...theme.typography.h4,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    // Content wrapper
  },
});
