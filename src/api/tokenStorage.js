import * as SecureStore from "expo-secure-store";

const REFRESH_KEY = "a3f91c8d4e7b2f0a9d65c4b17ef82ab3c91df0f4e2b8c6d73e5fa19c0b47da51";

// Save refresh token securely
export async function saveRefreshToken(token) {
  await SecureStore.setItemAsync(REFRESH_KEY, token);
}

// Get refresh token
export async function getRefreshToken() {
  return await SecureStore.getItemAsync(REFRESH_KEY);
}

// Delete refresh token
export async function deleteRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}
