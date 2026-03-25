const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/";
const container = document.querySelector(".roomscontainer");
const sizeFilter = document.getElementById("sizeFilter");
const priceFilter = document.getElementById("priceFilter");
let allRooms = [];

function isLoggedIn() {
  return localStorage.getItem("access_token");
}

function renderFavButton(roomId, title, image) {
  if (!isLoggedIn()) return ""; 
  return `<button class="fav-btn" onclick="addToFavs(${roomId}, '${title}', '${image}')">Add to favs</button>`;
}

async function getRooms() {
  try {
    const res = await fetch(`${API_URL}rooms`);
    allRooms = await res.json();
    renderRooms(allRooms);
  } catch (err) {
    console.error(err);
  }
}

function renderRooms(rooms) {
  container.innerHTML = "";
  rooms.forEach(room => {
    container.innerHTML += `
      <div class="rom-card">
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
            <button class="boook-btn" onclick="reserveRoom(${room.id})">Reserve Now</button>
            ${isLoggedIn() ? `<button class="favvvv-btn" onclick="addToFavs(${room.id}, '${room.title}', '${room.image}', '${room.price}', '${room.size}', '${room.description}')">Add to favs</button>` : ""}
          </div>
        </div>
      </div>
    `;
  });
}

function reserveRoom(roomId) {
  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }
  window.location.href = "contact.html";
}

async function addToFavs(id, title, image, price, size, description) {
  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}favs`);
    const favs = await res.json();
    const exists = favs.find(fav => String(fav.productId) === String(id));
    
    if (exists) {
      alert("This room is already in your favorites");
      return;
    }

    await fetch(`${API_URL}favs`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ 
        productId: id, 
        title, 
        image, 
        price, 
        size, 
        description 
      })
    });

    alert("Added to favorites");
  } catch (err) {
    console.error("Error adding to favorites:", err);
  }
}

function applyFilters() {
  let filtered = allRooms;
  const sizeValue = sizeFilter.value;
  const priceValue = priceFilter.value;

  if (sizeValue) {
    filtered = filtered.filter(room => {
      const size = parseFloat(room.size);
      if (sizeValue === "small") return size <= 20;
      if (sizeValue === "medium") return size > 20 && size <= 40;
      if (sizeValue === "large") return size > 40;
    });
  }

  if (priceValue) {
    filtered = filtered.filter(room => {
      const price = parseFloat(room.price);
      if (priceValue === "low") return price < 200;
      if (priceValue === "mid") return price >= 200 && price <= 300;
      if (priceValue === "high") return price > 400;
    });
  }
  renderRooms(filtered);
}

sizeFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

getRooms();