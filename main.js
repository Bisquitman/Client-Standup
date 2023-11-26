import "./style.scss";
import { scrollIntoView } from "seamless-scroll-polyfill";
import { getComedians } from "./scripts/api.js";
import { declOfNum } from "./scripts/helpers.js";
import { initForm } from "./scripts/form.js";
import { createComedianBlock } from "./scripts/comedians.js";
import {preload} from "./scripts/preloader.js";

preload.init();

const bookingSection = document.getElementById("booking");
const btnReserve = document.querySelector(".event__button_reserve");

const init = async () => {
  const bookingComediansList = document.querySelector(".booking__comedians-list");
  const bookingForm = document.querySelector(".booking__form");
  const countComedians = document.querySelector(".event__info-item_comedians");
  const bookingInputPhone = document.querySelector(".booking__input_phone");
  const bookingInputTicket = document.querySelector(".booking__input_ticket");

  btnReserve.addEventListener("click", (e) => {
    e.preventDefault();
    scrollIntoView(bookingSection, { behavior: "smooth", block: "start", inline: "start" });
  });

  preload.add(document.body);

  const comedians = await getComedians();
  console.log("comedians: ", comedians);
  initForm(bookingForm, bookingInputPhone, bookingInputTicket);

  if (comedians) {
    countComedians.innerHTML = `<span class="event__info-number">${comedians.length}</span>${declOfNum(comedians.length, [
      "комик",
      "комика",
      "комиков",
    ])}`;
    const comedianBlock = createComedianBlock(comedians, bookingComediansList);
    bookingComediansList.append(comedianBlock);
  }

  preload.remove(document.body);
};
init();
