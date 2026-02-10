const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/";
const container = document.querySelector(".fav-container"); 

async function displayFavoriteRooms() {
  const favIds = JSON.parse(sessionStorage.getItem("favs")) || [];

  if (favIds.length === 0) {
    container.innerHTML = "<h2>No favorites yet</h2>";
    return;
  }

  try {
    const resp = await fetch(`${API_URL}rooms`);
    const allData = await resp.json();

    const favoriteRooms = allData.filter(room =>
      favIds.includes(Number(room.id))
    );

    renderFavs(favoriteRooms);
  } catch (error) {
    console.error(error);
  }
}


function renderFavs(arr) {
    container.innerHTML = "";
    
    arr.forEach(room => {
        container.innerHTML += `
            <div class="rom-card">
                <img src="${room.image}" alt="">
                <h3>${room.title}</h3>
                <div class="restt">
                   <p><strong>Size:</strong> ${room.size}m²</p>
                    <p><strong>Price:</strong> $${room.price}</p>
                   <button class="remove-btn" onclick="removeFromFav(${room.id})">Remove</button>
                </div>
            </div>`;
    });
}

function removeFromFav(id) {
  let favs = JSON.parse(sessionStorage.getItem("favs")) || [];

  id = Number(id);

  favs = favs.filter(item => item !== id);

  sessionStorage.setItem("favs", JSON.stringify(favs));
  displayFavoriteRooms();
}


document.addEventListener("DOMContentLoaded", displayFavoriteRooms);




