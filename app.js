const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/";
const container = document.querySelector(".roomscontainer");

async function hotelrooms() {
    try {
        const resp = await fetch(`${API_URL}rooms`);
        const data = await resp.json();
        generate(data);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

function generate(arr) {
    container.innerHTML = "";

    arr.forEach((room) => {
        container.innerHTML += `
      <div class="rom-card">
        <div class="fav-btn" onclick="goToFavs(${room.id})">
          <svg width="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/>
          </svg>
          <span class="fav-text">View in Favorites</span>
        </div>
        <img src="${room.image}" alt="">
        <h3>${room.title}</h3>
        <div class="restt">
          <p><strong>Size:</strong> ${room.size}m²</p>
          <p><strong>Price:</strong> $${room.price}</p>
          <button onclick="location.href='contact.html'">RESERVE THIS ROOM</button>
       <button class="del-btn" onclick="deleteRoom(${room.id})"> Delete</button>
          </div>
      </div>`;
    });
}


function goToFavs(id) {
  let favs = JSON.parse(sessionStorage.getItem("favs")) || [];

  id = Number(id); 

  if (!favs.includes(id)) {
    favs.push(id);
    sessionStorage.setItem("favs", JSON.stringify(favs));
  }

  window.location.href = "fav.html";
}




document.addEventListener("DOMContentLoaded", hotelrooms);


async function addRoom() {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const size = document.getElementById("size").value;
  const image = document.getElementById("image").value;

  if (!title || !price || !size || !image) {
    alert("Fill all fields!");
    return;
  }

  await fetch(`${API_URL}rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, price, size, image })
  });

  hotelrooms(); 
}

async function deleteRoom(id){
  await fetch(`${API_URL}rooms/${id}`, { method:"DELETE" });
  hotelrooms();
}


let isAdmin = false;

function toggleAdmin(){
  isAdmin = !isAdmin;
  document.body.classList.toggle("admin", isAdmin);
  document.querySelector(".admin-toggle").classList.toggle("active", isAdmin);
}




