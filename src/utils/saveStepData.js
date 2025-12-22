import * as SecureStore from "expo-secure-store";

export async function saveStepData(payload) {
  const token = await SecureStore.getItemAsync("authToken");
  const res = await fetch("https://qup.dating/api/mobile/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("❌ Server error:", res.status, await res.text());
    return null;
  }

  return await res.json();
}
