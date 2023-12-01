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
