import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

/**
 * Component to set Android navigation bar (system buttons) color
 * to match the glassmorphic theme
 */
export default function useNavigationBarColor() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set navigation bar background color to match theme
      NavigationBar.setBackgroundColorAsync('#1a1a2e'); // Dark navy blue
      
      // Set button color to light (white icons)
      NavigationBar.setButtonStyleAsync('light');
      
      // Optional: Make it translucent for true glassmorphic effect
      // NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  return null;
}

// Alternative: Direct function export
export const setNavigationBarTheme = async () => {
  if (Platform.OS === 'android') {
    try {
      // Set to dark navy blue matching the theme
      await NavigationBar.setBackgroundColorAsync('#1a1a2e');
      
      // Light buttons (white icons)
      await NavigationBar.setButtonStyleAsync('light');
      
      // Optional: Set to translucent
      // await NavigationBar.setPositionAsync('absolute');
      // await NavigationBar.setBackgroundColorAsync('#1a1a2e80'); // 50% opacity
    } catch (error) {
      console.error('Failed to set navigation bar color:', error);
    }
  }
};
