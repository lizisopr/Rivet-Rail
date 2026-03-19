document.addEventListener("DOMContentLoaded", () => {
  const authSection = document.querySelector(".auth-buttons");
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  const token = localStorage.getItem("access_token");

  if (userData && token && authSection) {
    authSection.innerHTML = `
      <div style="position: relative; display: inline-block;">
        <img src="${userData.avatar || 'https://via.placeholder.com/40'}" id="profileTrigger" 
             style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer; object-fit: cover; border: 2px solid #ddd;">
        
        <div id="profileCard" style="display: none; position: absolute; right: 0; top: 50px; 
             background: white; border: 1px solid #ccc; padding: 15px; width: 200px; 
             box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; z-index: 1000;">
          <p style="margin: 0; font-weight: bold; color: #333;">${userData.firstName} ${userData.lastName}</p>
          <p style="margin: 5px 0; font-size: 12px; color: #777;">${userData.email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
          <button id="goToEdit" style="width: 100%; padding: 8px; cursor: pointer; margin-bottom: 5px;">Edit Profile</button>
          <button id="logoutBtn" style="width: 100%; padding: 8px; cursor: pointer; color: white; background: #ff4747; border: none; border-radius: 4px;">Logout</button>
        </div>
      </div>
    `;

    const trigger = document.getElementById("profileTrigger");
    const card = document.getElementById("profileCard");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      card.style.display = card.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", () => {
      card.style.display = "none";
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });

    document.getElementById("goToEdit").addEventListener("click", () => {
      window.location.href = "edit-profile.html";
    });
  }
});