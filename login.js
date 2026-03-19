const inputs = document.querySelectorAll("#loginForm input");
const API_URL = "https://api.everrest.educata.dev/auth/sign_in";

if (localStorage.getItem('access_token')) {
  window.location.href = "rooms.html";
}

async function logIn(event) {
  event.preventDefault();
  const credentials = { email: inputs[0].value, password: inputs[1].value };
  
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(credentials)
    });
    
    const answer = await resp.json();
    
    if (resp.ok && answer.access_token) {
      localStorage.setItem("access_token", answer.access_token);
      localStorage.setItem("refresh_token", answer.refresh_token);
      localStorage.setItem("currentUser", JSON.stringify(answer.user));
      
      window.location.href = "rooms.html";
    } else {
      alert("Invalid email or password");
    }
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("loginForm").addEventListener("submit", logIn);