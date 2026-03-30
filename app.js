const URL_API = "https://6988a45c780e8375a688d0f5.mockapi.io/";
const container = document.querySelector(".roomscontainer");
const sizeFilter = document.getElementById("sizeFilter");
const priceFilter = document.getElementById("priceFilter");

let allRooms = [];

document.addEventListener("DOMContentLoaded", () => {
  getRooms();
});

async function getRooms() {
  try {
    const res = await fetch(`${URL_API}rooms`);
    allRooms = await res.json();
    renderRooms(allRooms);
  } catch (err) {
    console.error(err);
  }
}

function renderRooms(rooms) {
  if (!container) return;
  container.innerHTML = "";

  rooms.forEach(room => {
    const card = document.createElement("div");
    card.className = "rom-card";
    card.innerHTML = `
      <img src="${room.image}" alt="${room.title}">
      <div class="restt">
        <h3 class="card__title">
          <a href="details.html?id=${room.id}" style="text-decoration:none; color:inherit;">
            ${room.title}
          </a>
        </h3>
        <p><strong>Size:</strong> ${room.size}m²</p>
        <p><strong>Price:</strong> $${room.price}</p>
        <div class="button-group">
          <button class="boook-btn">Reserve Now</button>
          <button class="favvvv-btn">Add to favs</button>
        </div>
      </div>
    `;

    card.querySelector(".boook-btn").addEventListener("click", () => {
      if (!localStorage.getItem("currentUser")) {
        window.location.href = "login.html";
        return;
      }
      window.location.href = "reserve.html";
    });

    card.querySelector(".favvvv-btn").addEventListener("click", () => addToFavs(room));

    container.appendChild(card);
  });
}

async function addToFavs(room) {
  try {
    const email = localStorage.getItem("currentUser");

    if (!email) {
      window.location.href = "login.html";
      return;
    }

    const res = await fetch(`${URL_API}favs`);
    const favs = await res.json();

    const exists = favs.find(fav =>
      String(fav.productId) === String(room.id) &&
      fav.userId === email
    );

    if (exists) {
      alert("Already in favorites");
      return;
    }

    await fetch(`${URL_API}favs`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        userId: email,
        productId: room.id,
        title: room.title,
        image: room.image,
        price: room.price,
        size: room.size,
        description: room.description || "No description available"
      })
    });

    alert("Added to favorites");

  } catch (err) {
    console.error(err);
  }
}

function applyFilters() {
  let filtered = [...allRooms];
  const sVal = sizeFilter?.value;
  const pVal = priceFilter?.value;

  if (sVal) {
    filtered = filtered.filter(r => {
      const s = parseFloat(r.size);
      if (sVal === "small") return s <= 20;
      if (sVal === "medium") return s > 20 && s <= 40;
      if (sVal === "large") return s > 40;
      return true;
    });
  }

  if (pVal) {
    filtered = filtered.filter(r => {
      const p = parseFloat(r.price);
      if (pVal === "low") return p < 200;
      if (pVal === "mid") return p >= 200 && p <= 300;
      if (pVal === "high") return p > 400;
      return true;
    });
  }

  renderRooms(filtered);
}

sizeFilter?.addEventListener("change", applyFilters);
priceFilter?.addEventListener("change", applyFilters);