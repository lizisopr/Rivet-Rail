
const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/favs";
const container = document.querySelector(".fav-container");

async function getFavs() {
  try {
    const res = await fetch(API_URL);
    const favs = await res.json();
    renderFavs(favs);
  } catch (err) {
    console.error(err);
  }
}

function renderFavs(favs) {
  container.innerHTML = "";
  favs.forEach(fav => {
    container.innerHTML += `
      <div class="rom-card">
        <img src="${fav.image}" alt="${fav.title}">
        <div class="restt">
          <div class="card__title--container">
            <h3 class="card__title">${fav.title}</h3>
          </div>
          <div class="button-group">
            <button class="book-btn" onclick="window.location.href='contact.html'">RESERVE NOW</button>
            <button class="remove-btn" onclick="removeFromFavs('${fav.id}')">REMOVE</button>
          </div>
        </div>
      </div>
    `;
  });
}

async function removeFromFavs(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    getFavs();
  } catch (err) {
    console.error(err);
  }
}

getFavs();




