import TomSelect from "tom-select";
import { MAX_COMEDIANS } from "./const.js";

export const createComedianBlock = (comedians, bookingComediansList) => {
  const bookingComedian = document.createElement("li");
  bookingComedian.className = "booking__comedian";

  const bookingSelectComedian = document.createElement("select");
  bookingSelectComedian.className = "booking__select booking__select_comedian";

  const bookingSelectTime = document.createElement("select");
  bookingSelectTime.className = "booking__select booking__select_time";

  const inputHidden = document.createElement("input");
  inputHidden.type = "hidden";
  inputHidden.name = "booking";

  const bookingHallBtn = document.createElement("button");
  bookingHallBtn.className = "booking__hall-btn";
  bookingHallBtn.type = "button";

  bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);

  const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
    create: false,
    hideSelected: true,
    placeholder: "Выбрать комика",
    sortField: {
      field: "text",
      direction: "asc",
    },
    options: comedians.map((comedian) => ({
      value: comedian.id,
      text: comedian.comedian,
    })),
  });
  const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
    create: false,
    hideSelected: true,
    placeholder: "Время",
    sortField: {
      field: "text",
      direction: "asc",
    },
  });
  bookingTomSelectTime.disable();

  bookingTomSelectComedian.on("change", (id) => {
    bookingTomSelectComedian.blur();
    bookingTomSelectTime.enable();
    const { performances } = comedians.find((comedian) => comedian.id === id);
    bookingTomSelectTime.clear();
    bookingTomSelectTime.clearOptions();
    bookingTomSelectTime.addOptions(
      performances.map((performance) => ({
        value: performance.time,
        text: performance.time,
      })),
    );
    bookingHallBtn.remove();
  });

  bookingTomSelectTime.on("change", (time) => {
    if (!time) return;

    const idComedian = bookingTomSelectComedian.getValue();
    const { performances } = comedians.find((item) => item.id === idComedian);
    const { hall } = performances.find((item) => item.time === time);
    inputHidden.value = `${idComedian},${time}`;
    bookingTomSelectTime.blur();
    bookingHallBtn.innerHTML = `
      ${hall}
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M9 3.5H3V9.5H5V5.5H9V3.5ZM3 21.5V15.5H5V19.5H9V21.5H3ZM15 3.5V5.5H19V9.5H21V3.5H15ZM19 15.5H21V21.5H15V19.5H19V15.5ZM7 7.5H11V11.5H7V7.5ZM7 13.5H11V17.5H7V13.5ZM17 7.5H13V11.5H17V7.5ZM13 13.5H17V17.5H13V13.5Z"
          fill="currentColor" />
      </svg>
    `;
    bookingComedian.append(bookingHallBtn);
  });

  const createNextBookingComedian = () => {
    if (bookingComediansList.children.length <= MAX_COMEDIANS) {
      const nextComediansBlock = createComedianBlock(comedians, bookingComediansList);
      bookingComediansList.append(nextComediansBlock);
    }
    bookingTomSelectTime.off("change", createNextBookingComedian);
  };

  bookingTomSelectTime.on("change", createNextBookingComedian);

  return bookingComedian;
};
