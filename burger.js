document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("header");
  if (!headerContainer) return;

  try {
    const res = await fetch("header.html");
    const html = await res.text();
    headerContainer.innerHTML = html;

    renderAuthInMenu();
    initHeaderLogic();
  } catch (err) {
    console.error(err);
  }
});

function renderAuthInMenu() {
  const navMenu = document.querySelector(".navmenu");
  if (!navMenu) return;

  const user = JSON.parse(localStorage.getItem("userData") || "null");
  const authWrapper = document.createElement("div");
  authWrapper.className = "mobile-auth-wrapper";

  if (user) {
    authWrapper.innerHTML = `
      <div class="mobile-profile-section">
        <a href="profile.html">
          <img src="${user.avatar || 'https://via.placeholder.com/40'}" class="profile-avatar-small">
          <span>My Profile</span>
        </a>
        <button onclick="logout()" class="logout-mobile">Logout</button>
      </div>
    `;
  } else {
    authWrapper.innerHTML = `
      <div class="mobile-auth-buttons">
        <a href="login.html" class="auth-btn">Sign In</a>
        <a href="signup.html" class="auth-btn auth-start">Get Started</a>
      </div>
    `;
  }
  navMenu.appendChild(authWrapper);
}

function initHeaderLogic() {
  const burger = document.getElementById("burger-checkbox");
  const navMenu = document.querySelector(".navmenu");
  if (!burger || !navMenu) return;

  const closeMenu = () => { burger.checked = false; };

  const allLinks = navMenu.querySelectorAll("a");
  allLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  const path = window.location.pathname.split("/").pop() || "index.html";
  allLinks.forEach(link => {
    if (link.dataset.page) {
      const isCurrent = path.includes(link.dataset.page) || (path === "index.html" && link.dataset.page === "index");
      link.style.display = isCurrent ? "none" : "block";
    }
  });
}

function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}