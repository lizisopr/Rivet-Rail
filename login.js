const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const API_URL = "https://api.everrest.educata.dev/auth/sign_in";

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    console.log("Email and password are required.");
    return;
  }

  const userData = { email, password };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Sign in failed:", data.message || "Invalid credentials");
      return;
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "rooms.html";

  } catch (error) {
    console.error("Network error:", error);
  }
});