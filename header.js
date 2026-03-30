document.addEventListener("DOMContentLoaded", async () => {
  const headerContainer = document.getElementById("header");
  if (!headerContainer) return;

  try {
    const res = await fetch("header.html");
    const html = await res.text();
    headerContainer.innerHTML = html;

    renderAuthUI();
    initHeaderLogic();
    updateActiveLinks();
  } catch (err) {
    console.error(err);
  }
});

function renderAuthUI() {
  const email = localStorage.getItem("currentUser");
  const user = email ? JSON.parse(localStorage.getItem(`user_${email}`)) : null;

  const authContainer = document.getElementById("authContainer");
  const navMenu = document.querySelector(".navmenu");
  const isMobile = window.innerWidth <= 600;

  if (authContainer) {
    if (user) {
      authContainer.innerHTML = `
        <div style="display:${isMobile ? "none" : "flex"};align-items:center;">
          <a href="profile.html" class="profile-link">
            <img src="${user.avatar || "https://ui-avatars.com/api/?name=User"}" class="profile-avatar">
          </a>
        </div>`;
    } else {
      authContainer.innerHTML = `
        <div style="display:${isMobile ? "none" : "flex"};gap:10px;align-items:center;">
          <a href="login.html">Sign In</a>
          <a href="signup.html">Get Started</a>
        </div>`;
    }
  }

  if (navMenu) {
    const old = navMenu.querySelector(".mobile-auth-wrapper");
    if (old) old.remove();

    const wrapper = document.createElement("div");
    wrapper.className = "mobile-auth-wrapper";

 if (user) {
  wrapper.innerHTML = `
    <div class="mobile-profile-container">
      <a href="profile.html" class="mobile-profile-link">
        <img src="${user.avatar || "https://ui-avatars.com/api/?name=User"}" class="profile-avatar"> <span class="profile-text">Profile</span>  </a>
      <button id="logoutBtnMobile" class="logout-mobile">Logout</button>
    </div>`;
}else {
      wrapper.innerHTML = `
        <a href="login.html">Sign In</a>
        <a href="signup.html">Get Started</a>`;
    }

    navMenu.appendChild(wrapper);
  }

  document.getElementById("logoutBtnMobile")?.addEventListener("click", logout);
}

window.addEventListener("resize", renderAuthUI);

function initHeaderLogic() {
  const burger = document.getElementById("burger-checkbox");
  const navLinks = document.querySelectorAll(".navmenu a");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (burger) burger.checked = false;
    });
  });
}

function updateActiveLinks() {
  const path = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll(".somee a, .navmenu a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href").toLowerCase();
    const page = link.dataset.page;

    const isActive = (path === href) || 
                     (path === "/" && (href === "/index.html" || page === "index")) ||
                     (path.endsWith(href.replace(/^\//, ""))) ||
                     (page && path.includes(page));

    if (isActive) {
      link.style.display = "none";
    } else {
      link.style.display = "";
    }
  });
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}