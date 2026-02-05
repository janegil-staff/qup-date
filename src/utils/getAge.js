const getAge = (birthdate) => {
  if (!birthdate) return null;

  const today = new Date();
  const dob = new Date(birthdate);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  // If birthday hasn't happened yet this year, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export default getAge;