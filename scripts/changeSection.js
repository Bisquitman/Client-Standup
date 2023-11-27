import { createComedianBlock } from './comedians.js';

export const initChangeSection = (
  bookingForm,
  eventSection,
  bookingSection,
  btnReserve,
  btnEdit,
  bookingTitle,
  comedians,
  bookingComediansList,
) => {
  btnReserve.style.transition = 'opacity 0.5s, visibility 0.5s';
  btnEdit.style.transition = 'opacity 0.5s, visibility 0.5s';
  btnReserve.classList.remove('event__button_hidden');
  btnEdit.classList.remove('event__button_hidden');

  const changeSection = () => {
    eventSection.classList.toggle('event_hidden');
    bookingSection.classList.toggle('booking_hidden');

    if (!bookingSection.classList.contains) {
      const comedianBlock = createComedianBlock(comedians, bookingComediansList);
      bookingComediansList.append(comedianBlock);
    }
    
  };

  btnReserve.addEventListener('click', (e) => {
    changeSection();
    bookingTitle.textContent = 'Забронируйте место в зале';
    bookingForm.method = 'POST';
  });
  btnEdit.addEventListener('click', (e) => {
    changeSection();
    bookingTitle.textContent = 'Редактирование брони';
    bookingForm.method = 'PATCH';
  });
  return changeSection;
};
