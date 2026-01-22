// utils/profileService.js

// Normalize: always lowercase for consistency
export function normalizeValue(val) {
  return typeof val === "string" ? val.toLowerCase() : val;
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
    children: normalizeValue(user.children),

    // Step 4: Habits
    sleep: normalizeValue(user.sleep),
    pets: normalizeValue(user.pets),
    hobbies: user.hobbies || "",

    // Step 5: Bio + Images
    bio: user.bio || "",
    profileImage: user.profileImage || "",
    images: user.images || [],

    // Common fields
    name: user.name || "",
    gender: normalizeValue(user.gender),
    birthdate: user.birthdate || "",

    location: user.location || null,

    searchScope:
      typeof user.searchScope === "string"
        ? user.searchScope.toLowerCase()
        : "worldwide",

    willingToRelocate:
      typeof user.willingToRelocate === "string"
        ? user.willingToRelocate === "true"
        : Boolean(user.willingToRelocate),
  };
}
