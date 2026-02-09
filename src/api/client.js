import { refreshAccessToken } from "./auth";

const API_URL = "https://qup.daing/api";

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  useAuth = false
) {
  const headers = { "Content-Type": "application/json" };

  if (useAuth) {
    if (!global.accessToken) {
      global.accessToken = await refreshAccessToken();
    }
    headers.Authorization = `Bearer ${global.accessToken}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  // If token expired, try refresh once
  if (res.status === 401 && useAuth) {
    global.accessToken = await refreshAccessToken();
    headers.Authorization = `Bearer ${global.accessToken}`;
    const retry = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    if (!retry.ok) throw new Error("API error after refresh");
    return retry.json();
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error: ${res.status} ${errorText}`);
  }

  return res.json();
}
