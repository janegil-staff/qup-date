import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";


export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    try {
      console.log("\n=== pickImages called ===");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow access to your photos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: "image/jpeg",
          fileName: asset.fileName || `image_${Date.now()}_${index}.jpg`,
        }));
        
        setSelectedImages(prev => [...prev, ...newImages]);
        console.log("✅ Selected", newImages.length, "images");
      }
    } catch (error) {
      console.error("❌ Pick error:", error);
    }
  };

  const uploadImages = async () => {

    if (selectedImages.length === 0) {
      console.log("No images, returning success");
      return { success: true, urls: [] };
    }

    setUploading(true);
    
    try {
 
      const formData = new FormData();
      
      selectedImages.forEach((image, i) => {
        console.log(`Adding image ${i+1}:`, image.uri?.substring(0, 40));
        formData.append("images", {
          uri: image.uri,
          type: "image/jpeg",
          name: image.fileName,
        });
      });

      const response = await fetch("https://qup.dating/api/mobile/upload", {
        method: "POST",
        body: formData,
      });
 
      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Server error: ${text.substring(0, 100)}`);
      }

      const data = JSON.parse(text);
      const urls = data.images?.map(img => img.url) || [];
      


      setSelectedImages([]);
      return { success: true, urls };

    } catch (error) {
      console.error("🔥 UPLOAD ERROR:", error);
      console.error("🔥 Error message:", error?.message);
      
      Alert.alert("Upload Failed", error?.message || "Unknown error");
      return { success: false, urls: [], error: error?.message || "Unknown error" };
      
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setSelectedImages([]);
  };

  return {
    selectedImages,
    uploading,
    pickImages,
    uploadImages,
    removeImage,
    clearImages,
  };
}