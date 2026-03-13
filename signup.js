const inputs = document.querySelectorAll("#signupForm input");
const SIGNUP_URL = "https://api.everrest.educata.dev/auth/sign_up";
const VERIFY_URL = "https://api.everrest.educata.dev/auth/verify_email";

async function register(event) {
  event.preventDefault();

  const credentials = {
    firstName: inputs[0].value,
    lastName: inputs[1].value,
    age: Number(inputs[2].value),
    email: inputs[3].value,
    password: inputs[4].value,
    address: inputs[5].value,
    phone: inputs[6].value,
    zipcode: inputs[7].value,
    avatar: inputs[8].value,
    gender: inputs[9].value,
    type: "OTP"
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
      await sendVerificationCode(credentials.email);
      window.location.href = "verify.html";
    } else {
      alert(JSON.stringify(answer.errorKeys || answer.message));
    }
  } catch (error) {
    console.error(error);
  }
}

async function sendVerificationCode(email) {
  try {
    await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("signupForm").addEventListener("submit", register);