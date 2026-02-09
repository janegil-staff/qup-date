import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useImageUpload } from '../hooks/useImageUpload';

export default function ImageUploadTest() {
  const { selectedImages, uploading, pickImages, uploadImages } = useImageUpload();

  const testPicker = async () => {
    console.log("\n=== TEST: Image Picker ===");
    try {
      await pickImages();
      console.log("✅ Picker completed");
    } catch (error) {
      console.error("❌ Picker error:", error);
    }
  };

  const testUpload = async () => {
    console.log("\n=== TEST: Upload Images ===");
    try {
      const result = await uploadImages();
      console.log("✅ Upload result:", result);
      Alert.alert("Upload Result", JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("❌ Upload error:", error);
      Alert.alert("Upload Error", String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Upload Test</Text>
      
      <Text style={styles.info}>
        Selected: {selectedImages.length} images
      </Text>

      <TouchableOpacity style={styles.button} onPress={testPicker}>
        <Text style={styles.buttonText}>1. Pick Images</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, selectedImages.length === 0 && styles.buttonDisabled]} 
        onPress={testUpload}
        disabled={selectedImages.length === 0}
      >
        <Text style={styles.buttonText}>
          2. Upload {selectedImages.length} Image(s)
        </Text>
      </TouchableOpacity>

      {uploading && (
        <Text style={styles.uploading}>Uploading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#374151',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  uploading: {
    color: '#22c55e',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});
