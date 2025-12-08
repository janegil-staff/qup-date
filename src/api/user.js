import { apiRequest } from "./client";

// Get profile by ID
export async function getProfile(userId, token) {
  return apiRequest(`/profile/${userId}`, "GET", null, token);
}

// Update profile
export async function updateProfile(userId, payload, token) {
  return apiRequest(`/profile/${userId}`, "PUT", payload, token);
}
