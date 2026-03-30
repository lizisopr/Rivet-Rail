const signupForm = document.getElementById("signupForm");
const signupInputs = document.querySelectorAll("#signupForm input, #signupForm select");
const SIGNUP_URL = "https://api.everrest.educata.dev/auth/sign_up";

async function register(event) {
  event.preventDefault();

  const credentials = {
    firstName: signupInputs[0].value,
    lastName: signupInputs[1].value,
    age: Number(signupInputs[2].value),
    email: signupInputs[3].value,
    password: signupInputs[4].value,
    address: signupInputs[5].value,
    phone: signupInputs[6].value,
    zipcode: signupInputs[7].value,
    avatar: signupInputs[8].value,
    gender: signupInputs[9].value.toUpperCase(),
    type: "LINK"
  };

  try {
    const resp = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    const answer = await resp.json();

    if (resp.ok) {
      localStorage.setItem("userEmail", credentials.email);
      alert("Verification link sent to your email!");
      window.location.href = "login.html";
    } else {
      alert(JSON.stringify(answer.errorKeys || answer.message));
    }
  } catch (error) {
    console.error(error);
  }
}

if (signupForm) {
  signupForm.addEventListener("submit", register);
}