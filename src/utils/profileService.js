import * as SecureStore from "expo-secure-store";

/**
 * Normalize backend user → form state
 */
export function prefillProfile(user) {
  if (!user) return {};

  return {
    // basics
    education: user.education ?? "",
    
    relationship: user.relationshipStatus ?? "",
    religion: (user.religion || "").toLowerCase(),
    relationship: (user.relationshipStatus || "").toLowerCase(),
    children: user.hasChildren ? "has children" : "no children",

    smoking: user.smoking ?? "",
    drinking: user.drinking ?? "",
    exercise: user.exercise ?? "",

    // location
    location: user.location ?? null,
    city: user.location?.name ?? "",
    country: user.location?.country ?? "",

    // images
    images: user.images ?? [],
    profileImage: user.profileImage ?? "",

    // text
    bio: user.bio ?? "",
    lookingFor: user.lookingFor ?? "",

    location: user.location || {
      name: "",
      lat: null,
      lng: null,
      country: "",
    },
  };
}

/**
 * PATCH profile updates
 */
export async function saveProfile(payload) {
  try {
    const token = await SecureStore.getItemAsync("authToken");
    if (!token) throw new Error("No auth token");

    const res = await fetch("https://qup.dating/api/mobile/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    // IMPORTANT:
    // Your backend returns the UPDATED USER directly
    const updatedUser = await res.json();
    return updatedUser;
  } catch (err) {
    console.error("❌ saveProfile failed:", err);
    throw err;
  }
}
