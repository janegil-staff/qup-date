// src/api/auth.js
export async function registerUser({ name, email, password, day, month, year, gender, image }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("birthDay", day);
  formData.append("birthMonth", month);
  formData.append("birthYear", year);
  formData.append("gender", gender);

  if (image) {
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "profile.jpg",
    });
  }

  const res = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    body: formData, // browser/React Native sets Content-Type automatically
  });

  return res.json();
}
