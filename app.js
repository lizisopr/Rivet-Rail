const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/";
const container = document.querySelector(".roomscontainer");

async function getRooms() {
  const res = await fetch(`${API_URL}rooms`);
  const data =await res.json();

  renderRooms(data)
}

function renderRooms(rooms){
  container.innerHTML="";

  rooms.forEach(room => {
     container.innerHTML += `
      <div class="rom-card">
        <img src="${room.image}" alt="">
        <h3>${room.title}</h3>
        <div class="restt">
          <p><strong>Size:</strong> ${room.size}m²</p>
          <p><strong>Price:</strong> $${room.price}</p>
         <button onclick="location.href='contact.html'">RESERVE THIS ROOM</button> 
         <button onclick="addToFavs(${room.id}, '${room.title}', '${room.image}')"> Add to favs </button>
   </div>
      </div>
     `;
  });
}

async function addToFavs(id, title, image) {
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
    body: JSON.stringify({
    productId: id,
    title,
    image
    })
 });

  alert("Added to favorites");
}
  
getRooms();


