import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';

export default function GlassButton({ 
  title, 
  onPress, 
  variant = 'primary', // primary, secondary, danger, ghost
  disabled = false,
  style,
  textStyle,
  icon,
  children
}) {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return theme.gradients.primary;
      case 'secondary':
        return theme.gradients.secondary;
      case 'danger':
        return ['#ff4444', '#cc0000'];
      case 'ghost':
        return theme.gradients.glass;
      default:
        return theme.gradients.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'ghost':
        return theme.colors.textSecondary;
      default:
        return theme.colors.text;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        {title && (
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        )}
        {children}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  gradient: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 17,
    fontWeight: '700',
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
