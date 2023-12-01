export const displayClientInfo = (parent, data) => {
  parent.innerHTML += `
    <p class="booking__client-item"><b>Имя:</b> ${data.fullName}</p>
    <p class="booking__client-item"><b>Телефон:</b> ${data.phone}</p>
    <p class="booking__client-item"><b>Номер билета:</b> ${data.ticketNumber}</p>
  `;
};

export const displayBooking = (parent, clientData, comediansData) => {
  const bookingList = document.createElement("ul");
  bookingList.className = "booking__list";

  const bookingComedians = clientData.booking.map((bookingComedian) => {
    const comedian = comediansData.find((item) => item.id === bookingComedian.comedian);
    const performance = comedian.performances.find((item) => bookingComedian.time === item.time);

    return {
      comedian,
      performance,
    };
  });

  console.log('bookingComedians: ', bookingComedians);
  bookingComedians.sort((a, b) => a.performance.time.localeCompare(b.performance.time));

  const comedianElements = bookingComedians.map(({ comedian, performance }) => {
    const comedianElement = document.createElement("li");
    comedianElement.className = "booking__item";
    comedianElement.innerHTML = `
      <h3>${comedian.comedian}</h3>
      <p><b>Время:</b> ${performance.time}</p>
      <button 
        class="booking__hall-btn" 
        type="button" 
        data-booking="${clientData.fullName} ${clientData.ticketNumber} ${comedian.comedian} ${performance.time} ${
      performance.hall
    }">
        ${[performance.hall]}
        </svg>
      </button>
    `;
    return comedianElement;
  });
  bookingList.append(...comedianElements);
  parent.append(bookingList);
};
