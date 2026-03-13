const resendBtn = document.getElementById("resendBtn");
const statusMsg = document.getElementById("statusMsg");
const emailInput = document.getElementById("email");
const verifyForm = document.getElementById("verifyForm");

function getEmail() {
  const params = new URLSearchParams(window.location.search);
  const emailFromUrl = params.get("email");
  const storedEmail = localStorage.getItem("userEmail");
  const finalEmail = emailFromUrl || storedEmail || emailInput.value;

  if (finalEmail && emailInput) {
    emailInput.value = finalEmail;
    localStorage.setItem("userEmail", finalEmail);
  }
  return finalEmail;
}

if (resendBtn) {
  resendBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = getEmail();
    if (!email) return;

    resendBtn.innerText = "Sending...";
    try {
      const resp = await fetch("https://api.everrest.educata.dev/auth/verify_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      statusMsg.innerText = resp.ok ? "Verification link sent!" : "Error sending link";
      statusMsg.style.color = resp.ok ? "green" : "red";
    } catch (err) {
      statusMsg.innerText = "Network error";
    } finally {
      resendBtn.innerText = "Request New OTP";
    }
  });
}

if (verifyForm) {
  verifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const code = document.getElementById("code").value.trim();
    const email = getEmail();

    if (!code || !email) return;

    try {
      const resp = await fetch("https://api.everrest.educata.dev/auth/verify_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code })
      });

      if (resp.ok) {
        statusMsg.innerText = "Success! Redirecting...";
        statusMsg.style.color = "green";
        setTimeout(() => window.location.href = "login.html", 1500);
      } else {
        const data = await resp.json();
        statusMsg.innerText = data.message || "Invalid code or token";
        statusMsg.style.color = "red";
      }
    } catch (err) {
      statusMsg.innerText = "Connection failed";
    }
  });
}

window.addEventListener("load", () => {
  const currentUrl = window.location.href;
  const params = new URLSearchParams(window.location.search);
  let otpValue = params.get("otp");

  if (!otpValue && currentUrl.includes("/verify/")) {
    const urlParts = currentUrl.split("/verify/");
    otpValue = urlParts[urlParts.length - 1];
  }

  const email = getEmail();

  if (otpValue) {
    document.getElementById("code").value = otpValue;
  }

  if (otpValue && email) {
    statusMsg.innerText = "Processing verification...";
    statusMsg.style.color = "blue";
    setTimeout(() => {
      verifyForm.dispatchEvent(new Event("submit"));
    }, 500);
  }
});