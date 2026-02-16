const API_URL = "https://6988a45c780e8375a688d0f5.mockapi.io/";
const container = document.querySelector(".fav-container"); 

async function getFavs() {
  try {
    const res = await fetch(`${API_URL}favs`);
    const Data = await res.json();
    renderFavs(Data);
  }catch (error){
    console.log(error)
  }
};


function renderFavs(arr) {
    container.innerHTML = "";
    
    arr.forEach(item => {
        container.innerHTML += `
            <div class="rom-card">
                <img src="${item.image}" alt="">
                <h3>${item.title}</h3>
                <div class="restt">
                   <p><strong>Size:</strong> ${item.size}m²</p>
                    <p><strong>Price:</strong> $${item.price}</p>
                    <button onclick="location.href='contact.html'">RESERVE THIS ROOM</button> 
                   <button class="remove-btn" onclick="removeFromFav(${item.id})">Remove</button>
                </div>
            </div>`;
    });
}

async function  removeFromFav(id) {
 await fetch(`${API_URL}favs/${id}`, { method: "DELETE" });
 getFavs();
}

getFavs();





