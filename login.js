const loginForm = document.getElementById("loginForm");
const inputs = document.querySelectorAll("#loginForm input");
const LOGIN_URL = "https://api.everrest.educata.dev/auth/sign_in";

async function login(event) {
  event.preventDefault();

  const credentials = {
    email: inputs[0].value,
    password: inputs[1].value,
  };

  try {
    const resp = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const answer = await resp.json();

    if (resp.ok) {
      localStorage.setItem("access_token", answer.access_token);

      const userData = {
        email: answer.email,
        firstName: answer.firstName,
        lastName: answer.lastName,
        age: answer.age,
        avatar: answer.avatar,
        gender: answer.gender,
        address: answer.address,
        phone: answer.phone,
        zipcode: answer.zipcode
      };

      localStorage.setItem("currentUser", answer.email);
      localStorage.setItem(`user_${answer.email}`, JSON.stringify(userData));

      window.location.href = "index.html";
    } else {
      alert(answer.message || "Invalid credentials");
    }
  } catch (error) {
    console.error(error);
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", login);
}