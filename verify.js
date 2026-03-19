const resendBtn = document.getElementById("resendBtn");
const statusMsg = document.getElementById("statusMsg");
const emailInput = document.getElementById("email");
const verifyForm = document.getElementById("verifyForm");

function getEmail() {
  const params = new URLSearchParams(window.location.search);
  const emailFromUrl = params.get("email");
  const storedEmail = localStorage.getItem("userEmail");
  const finalEmail = emailFromUrl || storedEmail || (emailInput ? emailInput.value : "");

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
    
    if (!email) {
      statusMsg.innerText = "Email not found.";
      statusMsg.style.color = "red";
      return;
    }

    resendBtn.disabled = true;
    resendBtn.innerText = "Sending...";
    
    try {
      const resp = await fetch("https://api.everrest.educata.dev/auth/verify_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      statusMsg.innerText = resp.ok ? "OTP sent!" : "Error sending OTP";
      statusMsg.style.color = resp.ok ? "green" : "red";
    } catch (err) {
      statusMsg.innerText = "Network error";
      statusMsg.style.color = "red";
    } finally {
      resendBtn.disabled = false;
      resendBtn.innerText = "Request New OTP";
    }
  });
}

if (verifyForm) {
  verifyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const codeInput = document.getElementById("code");
    const code = codeInput ? codeInput.value.trim() : "";
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
        localStorage.removeItem("userEmail"); 
        setTimeout(() => window.location.href = "login.html", 2000);
      } else {
        const data = await resp.json();
        statusMsg.innerText = data.message || "Invalid code";
        statusMsg.style.color = "red";
      }
    } catch (err) {
      statusMsg.innerText = "Connection failed";
      statusMsg.style.color = "red";
    }
  });
}

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  let otpValue = params.get("otp");

  if (!otpValue) {
    const pathParts = window.location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.length === 6 && !isNaN(lastPart)) {
      otpValue = lastPart;
    }
  }

  const email = getEmail();

  if (otpValue) {
    const codeInput = document.getElementById("code");
    if (codeInput) codeInput.value = otpValue;
    
    if (email) {
      statusMsg.innerText = "Verifying...";
      setTimeout(() => {
        verifyForm.requestSubmit();
      }, 1000);
    }
  }
});