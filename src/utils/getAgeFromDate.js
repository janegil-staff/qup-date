/**
 * Calculate age from a given birthdate
 * @param {string|Date} birthdate - The user's birthdate
 * @returns {number} age in years
 */
export function getAgeFromDate(birthdate) {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}
