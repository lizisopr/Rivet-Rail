const form = document.querySelector("form");
const input = document.querySelectorAll("input");
const gender = document.querySelector("select");
const API_URL = "https://api.everrest.educata.dev/auth/sign_up";

form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
    
  let userData = {
    firstName: input[0].value.trim(),
    lastName: input[1].value.trim(),
    age: Number(input[2].value),
    email: input[3].value.trim(),
    password: input[4].value,
    address: input[5].value.trim(),
    phone: input[6].value.trim(),
    zipcode: input[7].value.trim(),
    avatar: input[8].value.trim(),
    gender: gender.value.toUpperCase()
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    }); 

    const answer = await response.json();

    if (response.ok) {
      window.location.href = "signin.html";
    } else {
      console.log("Signup failed:", answer.errorKeys || answer.error);
    }

  } catch (error) {
    console.log("Network error:", error);
  }
}