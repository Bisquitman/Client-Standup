import "./style.scss";
import TomSelect from "tom-select";
import { scrollIntoView } from "seamless-scroll-polyfill";
import { Notification } from "./scripts/Notification.js";
import Inputmask from "inputmask";
import JustValidate from "just-validate";

// const API_URL = "http://192.168.1.2:8080";
const API_URL = "https://full-lively-animal.glitch.me";
const MAX_COMEDIANS = 6;

const notification = Notification.getInstance();

const bookingComediansList = document.querySelector(".booking__comedians-list");
const bookingSection = document.getElementById("booking");
const btnReserve = document.querySelector(".event__button_reserve");
const bookingForm = document.querySelector(".booking__form");

const declOfNum = (n, titles) =>
  titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const createComedianBlock = (comedians) => {
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
      const nextComediansBlock = createComedianBlock(comedians);
      bookingComediansList.append(nextComediansBlock);
    }
    bookingTomSelectTime.off("change", createNextBookingComedian);
  };

  bookingTomSelectTime.on("change", createNextBookingComedian);

  return bookingComedian;
};

const getComedians = async () => {
  const response = await fetch(`${API_URL}/comedians`);

  return response.json();
};

const init = async () => {
  const countComedians = document.querySelector(".event__info-item_comedians");

  countComedians.innerHTML = `<span class="event__info-number">0</span>`;
  const comedians = await getComedians();
  console.log("comedians: ", comedians);
  countComedians.innerHTML = `<span class="event__info-number">${comedians.length}</span>${declOfNum(comedians.length, [
    "комик",
    "комика",
    "комиков",
  ])}`;

  const comedianBlock = createComedianBlock(comedians);

  bookingComediansList.append(comedianBlock);

  btnReserve.addEventListener("click", (e) => {
    e.preventDefault();
    scrollIntoView(bookingSection, { behavior: "smooth", block: "start", inline: "start" });
  });

  const validateBookingForm = new JustValidate(bookingForm, {
    errorFieldCssClass: "booking__input_invalid",
    successFieldCssClass: "booking__input_valid",
  });
  const bookingInputPhone = document.querySelector(".booking__input_phone");
  const bookingInputTicket = document.querySelector(".booking__input_ticket");
  new Inputmask("+375(99)-999-99-99").mask(bookingInputPhone);
  new Inputmask("99999999").mask(bookingInputTicket);

  validateBookingForm
    .addField(".booking__input_fullname", [
      {
        rule: "required",
        errorMessage: "Заполните поле «Имя»",
      },
    ])
    .addField(".booking__input_phone", [
      {
        rule: "required",
        errorMessage: "Заполните поле «Телефон»",
      },
      {
        validator() {
          const phoneValue = bookingInputPhone.inputmask.unmaskedvalue();
          return phoneValue.length === 9 && !!Number(phoneValue);
        },
        errorMessage: "Некорректный номер телефона",
      },
    ])
    .addField(".booking__input_ticket", [
      {
        rule: "required",
        errorMessage: "Заполните поле «Номер билета»",
      },
      {
        validator() {
          const ticketValue = bookingInputTicket.inputmask.unmaskedvalue();
          return ticketValue.length === 8 && !!Number(ticketValue);
        },
        errorMessage: "Неверный номер билета",
      },
    ])
    .onFail((fields) => {
      let errorMessage = "";
      for (const key in fields) {
        if (!Object.hasOwnProperty.call(fields, key)) {
          continue;
        }
        const element = fields[key];
        if (!element.isValid) {
          errorMessage += `${element.errorMessage},<br>`;
        }
      }
      notification.show(errorMessage.slice(0, -5), false);
    });

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = { booking: [] };
    const times = new Set();

    new FormData(bookingForm).forEach((value, field) => {
      if (field === "booking") {
        const [comedian, time] = value.split(",");

        if (comedian && time) {
          data.booking?.push({ comedian, time });
          times.add(time);
        }
      } else {
        data[field] = value;
      }

      if (times.size !== data.booking.length) {
        notification.show("Нельзя быть в одно время в разных местах", false);
        // notification -> 'Нельзя быть в одно время в разных местах'
      }
    });
  });
};
init();
