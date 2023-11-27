import './style.scss';
import { getComedians } from './scripts/api.js';
import { declOfNum } from './scripts/helpers.js';
import { initForm } from './scripts/form.js';
import { createComedianBlock } from './scripts/comedians.js';
import { preload } from './scripts/preloader.js';
import { initChangeSection } from './scripts/changeSection.js';

preload.init();

const init = async () => {
  const bookingComediansList = document.querySelector(
    '.booking__comedians-list',
  );
  const bookingForm = document.querySelector('.booking__form');
  const countComedians = document.querySelector('.event__info-item_comedians');
  const bookingInputPhone = document.querySelector('.booking__input_phone');
  const bookingInputTicket = document.querySelector('.booking__input_ticket');

  const eventSection = document.querySelector('.event');
  const bookingSection = document.getElementById('booking');
  const btnReserve = eventSection.querySelector('.event__button_reserve');
  const btnEdit = eventSection.querySelector('.event__button_edit');
  const bookingTitle = bookingSection.querySelector('.booking__title');

  preload.add(document.body);

  const comedians = await getComedians();

  if (comedians) {
    countComedians.innerHTML = `<span class="event__info-number">${
      comedians.length
    }</span>${declOfNum(comedians.length, ['комик', 'комика', 'комиков'])}`;

    const changeSection = initChangeSection(
      bookingForm,
      eventSection,
      bookingSection,
      btnReserve,
      btnEdit,
      bookingTitle,
      comedians,
      bookingComediansList,
    );
    initForm(
      bookingForm,
      bookingInputPhone,
      bookingInputTicket,
      changeSection,
      bookingComediansList,
    );
  }

  preload.remove(document.body);
};
init();
