import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || "https://qup.dating";

export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const imgs = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      }));
      setSelectedImages((prev) => [...prev, ...imgs]);
    }
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    setUploading(true);

    const formData = new FormData();
    selectedImages.forEach((img) => {
      formData.append("images", img);
    });

    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);
    setSelectedImages([]);

    return data.images || [];
  };

  return {
    selectedImages,
    uploading,
    pickImages,
    uploadImages,
    removeImage: (i) =>
      setSelectedImages((prev) => prev.filter((_, idx) => idx !== i)),
  };
}
