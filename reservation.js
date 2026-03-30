const API_URL = "https://69c31fe3b780a9ba03e61015.mockapi.io/reserv/peopleeee";

const reservationForm = document.querySelector(".reservation-form");

if (reservationForm) {
  reservationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = reservationForm.querySelectorAll("input");
    const select = reservationForm.querySelector("select");
    const textarea = reservationForm.querySelector("textarea");

    const date = inputs[0].value;
    const name = inputs[1].value;
    const email = inputs[2].value;
    const room = select.value;
    const guests = inputs[3].value;
    const phone = inputs[4].value;
    const time1 = inputs[5].value;
    const time2 = inputs[6].value;
    const request = textarea.value;

    if (!name || !email || !room || !guests) {
      alert("Fill required fields");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          name,
          email,
          room,
          days: guests,
          phone,
          time1,
          time2,
          request
        })
      });

      alert("Reservation sent!");
      reservationForm.reset();

    } catch (err) {
      console.error(err);
    }
  });
}