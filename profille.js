document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  const email = localStorage.getItem("currentUser");

  if (!token || !email) {
    window.location.href = "login.html";
    return;
  }

  let user = await fetchProfile(token, email);
  renderProfile(user);

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const profileInfo = document.getElementById("profileInfo");
  const editForm = document.getElementById("editForm");

  editBtn?.addEventListener("click", () => {
    profileInfo.style.display = "none";
    editForm.style.display = "block";
    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
    fillInputs(user);
  });

  saveBtn?.addEventListener("click", async () => {
    const success = await updateProfile();
    if (success) {
      profileInfo.style.display = "block";
      editForm.style.display = "none";
      editBtn.style.display = "inline-block";
      saveBtn.style.display = "none";
      user = JSON.parse(localStorage.getItem(`user_${email}`));
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", logout);
});

async function fetchProfile(token, email) {
  const localData = JSON.parse(localStorage.getItem(`user_${email}`) || "{}");
  try {
    const resp = await fetch("https://api.everrest.educata.dev/auth/me", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (resp.ok) {
      const serverData = await resp.json();
      const mergedData = { ...localData, ...serverData };
      localStorage.setItem(`user_${email}`, JSON.stringify(mergedData));
      return mergedData;
    }
  } catch (err) {
    console.error(err);
  }
  return localData;
}

function renderProfile(user) {
  document.getElementById("username").textContent = `${user.firstName || ""} ${user.lastName || ""}`;
  ["firstName", "lastName", "age", "gender", "email"].forEach(f => {
    const el = document.getElementById(f);
    if (el) el.textContent = user[f] || "N/A";
  });
  const def = "https://media.istockphoto.com/id/1161086440/vector/avatar-flat-icon-on-black-background-black-style-vector-illustration.jpg?s=612x612&w=0&k=20&c=ITquPbLvpLjMTAs8nR0g0y_FCrtE758wGLYTvn6F_TI=";
  document.getElementById("profileImage").src = user.avatar || def;
}

function fillInputs(user) {
  document.getElementById("editFirstName").value = user.firstName || "";
  document.getElementById("editLastName").value = user.lastName || "";
  document.getElementById("editAge").value = user.age || "";
  document.getElementById("editAvatar").value = user.avatar || "";
  document.getElementById("editAddress").value = user.address || "";
  document.getElementById("editPhone").value = user.phone || "";
  document.getElementById("editZipcode").value = user.zipcode || "";
  document.getElementById("editGender").value = user.gender || "MALE";
}

async function updateProfile() {
  const token = localStorage.getItem("access_token");
  const email = localStorage.getItem("currentUser");
  const oldData = JSON.parse(localStorage.getItem(`user_${email}`) || "{}");

  let phone = document.getElementById("editPhone").value.trim();
  if (phone && !phone.startsWith("+")) {
    phone = "+995" + phone.replace(/\D/g, "");
  }

  const updatedData = {
    firstName: document.getElementById("editFirstName").value.trim() || oldData.firstName,
    lastName: document.getElementById("editLastName").value.trim() || oldData.lastName,
    age: Number(document.getElementById("editAge").value) || oldData.age,
    gender: document.getElementById("editGender").value,
    address: document.getElementById("editAddress").value.trim() || oldData.address,
    phone: phone || oldData.phone,
    zipcode: document.getElementById("editZipcode").value.trim() || oldData.zipcode,
    avatar: document.getElementById("editAvatar").value.trim() || oldData.avatar
  };

  try {
    const resp = await fetch("https://api.everrest.educata.dev/auth/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    if (!resp.ok) {
      const result = await resp.json();
      alert("Error: " + JSON.stringify(result.errorKeys || result));
      return false;
    }

    localStorage.setItem(`user_${email}`, JSON.stringify(updatedData));
    renderProfile(updatedData);
    return true;
  } catch (err) {
    alert("Connection Error");
    return false;
  }
}

function goBack() {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}