const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/";
const container = document.querySelector(".roomscontainer");
const sizeFilter = document.getElementById("sizeFilter");
const priceFilter = document.getElementById("priceFilter");
let allRooms = [];

function isLoggedIn() {
  return localStorage.getItem("user");
}

function renderFavButton(roomId, title, image) {
  if (!isLoggedIn()) return "";
  return `<button onclick="addToFavs(${roomId}, '${title}', '${image}')">Add to favs</button>`;
}

async function getRooms() {
  const res = await fetch(`${API_URL}rooms`);
  allRooms = await res.json();
  renderRooms(allRooms);
}

function renderRooms(rooms){
  container.innerHTML = "";
  rooms.forEach(room => {
    container.innerHTML += `
      <div class="rom-card">
        <img src="${room.image}" alt="">
        <h3>${room.title}</h3>
        <div class="restt">
          <p><strong>Size:</strong> ${room.size}m²</p>
          <p><strong>Price:</strong> $${room.price}</p>
          <button class="book-btn" onclick="reserveRoom(${room.id})">Reserve Now</button>
          ${renderFavButton(room.id, room.title, room.image)}
        </div>
      </div>
    `;
  });
}

function reserveRoom(roomId){
  if(!isLoggedIn()){
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }
  window.location.href = "contact.html";
}

async function addToFavs(id, title, image) {
  if (!isLoggedIn()) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const res = await fetch(`${API_URL}favs`);
  const favs = await res.json();
  const exists = favs.find(fav => String(fav.productId) === String(id));
  if (exists) {
    alert("This room is already in your favorites");
    return;
  }

  await fetch(`${API_URL}favs`, {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify({ productId: id, title, image })
  });

  alert("Added to favorites");
}

function applyFilters() {
  let filtered = allRooms;
  const sizeValue = sizeFilter.value;
  const priceValue = priceFilter.value;

  if(sizeValue){
    filtered = filtered.filter(room => {
      const size = parseFloat(room.size);
      if(sizeValue === "small") return size <= 20;
      if(sizeValue === "medium") return size > 20 && size <= 40;
      if(sizeValue === "large") return size > 40;
    });
  }

  if(priceValue){
    filtered = filtered.filter(room => {
      const price = parseFloat(room.price);
      if(priceValue === "low") return price < 200;
      if(priceValue === "mid") return price >= 200 && price <= 300;
      if(priceValue === "high") return price > 400;
    });
  }

  renderRooms(filtered);
}

sizeFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);

getRooms();