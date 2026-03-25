
const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/favs";
const container = document.querySelector(".fav-container");

let gx_allData = [];
let gx_selectedIds = [];

async function getFavs() {
  try {
    const res = await fetch(API_URL);
    gx_allData = await res.json();
    renderFavs(gx_allData);
  } catch (err) { console.error(err); }
}

function gx_filter() {
  const search = document.getElementById('gx-search').value.toLowerCase();
  const sortType = document.getElementById('gx-sort').value;

  let result = gx_allData.filter(i => i.title.toLowerCase().includes(search));

  if (sortType === "low") result.sort((a, b) => a.price - b.price);
  if (sortType === "high") result.sort((a, b) => b.price - a.price);
  if (sortType === "size") result.sort((a, b) => b.size - a.size);

  renderFavs(result);
}

function gx_toggle(id) {
  const idx = gx_selectedIds.indexOf(id);
  if (idx > -1) gx_selectedIds.splice(idx, 1);
  else if (gx_selectedIds.length < 3) gx_selectedIds.push(id);
  else alert("Max 3 rooms for comparison");

  const btn = document.getElementById('gx-compare-trigger');
  btn.innerText = `Compare (${gx_selectedIds.length})`;
  btn.disabled = gx_selectedIds.length < 2;
  
  renderFavs(gx_allData);
}

function gx_openModal() {
  const modal = document.getElementById('gx-modal-overlay');
  const area = document.getElementById('gx-table-area');
  const picked = gx_allData.filter(r => gx_selectedIds.includes(r.id));

  area.innerHTML = `
    <table class="gx-table">
      <thead>
        <tr><th>Feature</th>${picked.map(p => `<th>${p.title}</th>`).join('')}</tr>
      </thead>
      <tbody>
        <tr><td>Price</td>${picked.map(p => `<td>${p.price}$</td>`).join('')}</tr>
        <tr><td>Size</td>${picked.map(p => `<td>${p.size}m²</td>`).join('')}</tr>
        <tr><td>Info</td>${picked.map(p => `<td>${p.description}</td>`).join('')}</tr>
      </tbody>
    </table>`;
  modal.style.display = "flex";
}

function gx_closeModal() {
  document.getElementById('gx-modal-overlay').style.display = "none";
}

function renderFavs(data) {
  container.innerHTML = "";
  data.forEach(fav => {
    const isSelected = gx_selectedIds.includes(fav.id);
    container.innerHTML += `
      <div class="luxury-card ${isSelected ? 'gx-highlight' : ''}">
        <div class="card-media">
          <img src="${fav.image}">
          <div class="price-tag">${fav.price}$</div>
          <button class="gx-mini-btn" onclick="gx_toggle('${fav.id}')">
            ${isSelected ? 'Selected' : '+ Compare'}
          </button>
        </div>
        <div class="card-body">
          <h3 class="card-name">${fav.title}</h3>
          <p class="card-text">${fav.description}</p>
          <div class="card-actions">
            <button class="action-delete" onclick="removeFromFavs('${fav.id}')">REMOVE</button>
          </div>
        </div>
      </div>`;
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




