const API_URL = "https://69c31fe3b780a9ba03e61015.mockapi.io/reserv/peopleeee";
const ADMIN_PASS = "1234";

const loginBtn = document.getElementById("loginBtn");
const adminPassword = document.getElementById("adminPassword");
const errorMsg = document.getElementById("errorMsg");
const adminPanel = document.getElementById("adminPanel");
const logoutBtn = document.getElementById("logoutBtn");
const tbody = document.querySelector("#adminPanel tbody");

const addBtn = document.getElementById("addBtn");
const newName = document.getElementById("newName");
const newRoom = document.getElementById("newRoom");
const newDays = document.getElementById("newDays");

function showAdminPanel() {
  document.querySelector(".login-wrapper").style.display = "none";
  adminPanel.classList.remove("hidden");
  getGuests();
}

if (localStorage.getItem("admin_logged_in") === "true") {
  showAdminPanel();
}

loginBtn.addEventListener("click", () => {
  if (adminPassword.value === ADMIN_PASS) {
    localStorage.setItem("admin_logged_in", "true");
    showAdminPanel();
  } else {
    errorMsg.textContent = "Wrong password!";
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("admin_logged_in");
  location.reload();
});

async function getGuests() {
  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();

    tbody.innerHTML = "";

    data.forEach(guest => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td data-label="ID">${guest.id}</td>
        <td data-label="Name">${guest.name || ""}</td>
        <td data-label="Email">${guest.email || ""}</td>
        <td data-label="Room">${guest.room || ""}</td>
        <td data-label="Days">${guest.days || ""}</td>
        <td data-label="Phone">${guest.phone || ""}</td>
        <td data-label="Date">${guest.date || ""}</td>
        <td data-label="Actions">
          <button class="edit-btn" onclick="editGuest('${guest.id}')">Edit</button>
          <button class="admindlt" onclick="deleteGuest('${guest.id}')">X</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error(error);
  }
}

addBtn.addEventListener("click", async () => {
  if (!newName.value || !newRoom.value || !newDays.value) {
    alert("Fill all fields");
    return;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.value,
        room: newRoom.value,
        days: newDays.value
      })
    });

    newName.value = "";
    newRoom.value = "";
    newDays.value = "";

    getGuests();

  } catch (error) {
    console.error(error);
  }
});

window.editGuest = async function(id) {
  const name = prompt("New Name:");
  const room = prompt("New Room:");
  const days = prompt("New Days:");

  if (!name || !room || !days) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, room, days })
    });

    getGuests();

  } catch (error) {
    console.error(error);
  }
};

window.deleteGuest = async function(id) {
  if (!confirm("Are you sure?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    getGuests();

  } catch (error) {
    console.error(error);
  }
};