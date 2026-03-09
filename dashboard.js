const API_URL = "https://699f330678dda56d396ca8b7.mockapi.io/menu/menu";
let editId = null;

const sections = {
  breakfast: document.querySelector("#breakfast .items-container"),
  lunch: document.querySelector("#lunch .items-container"),
  dinner: document.querySelector("#dinner .items-container"),
  dessert: document.querySelector("#dessert .items-container")
};

let allItems = [];

async function loadMenu() {
  try {
    const resp = await fetch(API_URL);
    const data = await resp.json();
    allItems = data;
    renderMenu(allItems);
  } catch (error) {
    console.error("Load Error:", error);
  }
}

function renderRow(item) {
  const validImg = item.image && item.image.startsWith("http")
    ? item.image
    : "https://via.placeholder.com/300x200?text=No+Image+Found";

  return `
    <div class="menu-item">
      <img class="foodimage" src="${validImg}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Error'">
      <div class="item-info">
        <div class="item-header">
          <h3>${item.name}</h3>
          <span class="foodprice">$${parseFloat(item.price).toFixed(2)}</span>
        </div>
        <p class="item-descr">${item.description || "Freshly made with premium ingredients."}</p>
        <div class="item-actions">
          <button class="edit-btn" onclick="editfood('${item.id}')">Edit</button>
          <button class="delete-btn" onclick="deletefood('${item.id}')">Delete</button>
        </div>
      </div>
    </div>
  `;
}

window.deletefood = async function(id) {
  const confirmation = confirm("Are you sure you want to delete this item?");
  if (!confirmation) return;

  try {
    const resp = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (resp.ok) {
      await loadMenu();
    }
  } catch (error) {
    console.error("Delete Error:", error);
  }
};

window.editfood = async function(id) {
  editId = id;
  const modal = document.getElementById("editModal");

  try {
    const resp = await fetch(`${API_URL}/${id}`);
    const data = await resp.json();

    document.getElementById("editName").value = data.name || "";
    document.getElementById("editPrice").value = data.price || "";
    document.getElementById("editCategory").value = data.category?.toLowerCase().trim() || "breakfast";
    document.getElementById("editDescription").value = data.description || "";
    document.getElementById("editImage").value = data.image || "";

    modal.classList.add("active");
  } catch (error) {
    console.error("Edit Load Error:", error);
  }
};

window.saveEdit = async function() {
  if (!editId) return;

  const updatedItem = {
    name: document.getElementById("editName").value.trim(),
    price: parseFloat(document.getElementById("editPrice").value),
    category: document.getElementById("editCategory").value,
    description: document.getElementById("editDescription").value.trim(),
    image: document.getElementById("editImage").value.trim()
  };

  try {
    const resp = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem)
    });

    if (resp.ok) {
      closeModal();
      await loadMenu();
    }
  } catch (error) {
    console.error("Save Error:", error);
  }
};

window.closeModal = function() {
  document.getElementById("editModal").classList.remove("active");
  editId = null;
};

function renderMenu(items) {
  Object.values(sections).forEach(sec => {
    if (sec) sec.innerHTML = "";
  });

  items.forEach(item => {
    const category = item.category?.toLowerCase().trim();
    if (sections[category]) {
      sections[category].insertAdjacentHTML("beforeend", renderRow(item));
    }
  });
}

loadMenu();