// src/api/testRegister.js
const API_URL = "http://localhost:3000/api";

export async function testRegister() {
  try {
    const payload = {
      name: "Test User",
      email: "testuser@example.com",
      password: "StrongPass123!",
      birthdate: "1995-05-20",
      gender: "male",
      image: null, // optional
    };

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Register response:", data);
    return data;
  } catch (err) {
    console.error("Register failed:", err);
  }
}
