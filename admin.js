const API_URL = "https://694c17f7da5ddabf00360e11.mockapi.io/goodPeople";
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

loginBtn.addEventListener("click", () => {
  if (adminPassword.value === ADMIN_PASS) {

    document.querySelector(".login-wrapper").style.display = "none";

    document.body.style.display = "block";
    document.body.style.height = "auto";

    adminPanel.classList.remove("hidden");

    getGuests();

  } else {
    errorMsg.textContent = "Wrong password!";
  }
});

logoutBtn.addEventListener("click", () => {
  location.reload();
});

async function getGuests() {
  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();

    tbody.innerHTML = "";

    data.forEach(guest => {
      tbody.innerHTML += `
        <tr>
          <td>${guest.id}</td>
          <td>${guest.name}</td>
          <td>${guest.room}</td>
          <td>${guest.days}</td>
          <td>
            <button class="edit-btn" onclick="editGuest('${guest.id}')">Edit</button>
            <button class="admindlt" onclick="deleteGuest('${guest.id}')">X</button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

window.editGuest = async function(id) {
  const newName = prompt("Enter new Name:");
  const newRoom = prompt("Enter new Room:");
  const newDays = prompt("Enter new Days:");

  if (newName && newRoom && newDays) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          room: newRoom,
          days: newDays
        })
      });

      getGuests();

    } catch (error) {
      console.error("Error updating guest:", error);
    }
  }
};

window.deleteGuest = async function(id) {
  if(confirm("Are you sure?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    getGuests();
  }
};

addBtn.addEventListener("click", async () => {

  if (!newName.value || !newRoom.value || !newDays.value) {
    alert("Fill all fields");
    return;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    console.error("Error adding guest:", error);
  }

});