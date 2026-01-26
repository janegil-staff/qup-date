// utils/profileService.js

// Normalize: always lowercase for consistency
export function normalizeValue(val) {
  return val ? val.toLowerCase() : "";
}

export function prefillProfile(user) {
  if (!user) return {};

  return {
    // Step 1: Appearance
    height: user.height || "",
    appearance: normalizeValue(user.appearance),
    bodyType: normalizeValue(user.bodyType),

    // Step 2: Lifestyle
    diet: normalizeValue(user.diet),
    exercise: normalizeValue(user.exercise),
    smoking: normalizeValue(user.smoking),
    drinking: normalizeValue(user.drinking),

    // Step 3: Details
    education: user.education || "",
    religion: normalizeValue(user.religion),
    relationship: normalizeValue(user.relationship),
    hasChildren: user.hasChildren ?? false,

    // Step 4: Habits
    sleep: normalizeValue(user.sleep),
    pets: normalizeValue(user.pets),
    hobbies: user.hobbies || "",

    // Step 5: Bio + Images
    bio: user.bio || "",
    profileImage: user.profileImage || "",
    images: user.images || [],
    tags: user.tags || [],

    // Common fields
    name: user.name || "",
    gender: normalizeValue(user.gender),
    birthdate: user.birthdate || "",

    // IMPORTANT: keep location as object
    location: user.location || null,

    // These now prefill correctly
    searchScope: user.searchScope || "worldwide",
    willingToRelocate: user.willingToRelocate ?? false,
  };
}
