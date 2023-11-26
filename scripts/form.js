import JustValidate from "just-validate";
import Inputmask from "inputmask";
import { Notification } from "./Notification.js";

const notification = Notification.getInstance();

export const initForm = (bookingForm, bookingInputPhone, bookingInputTicket) => {
  const validateBookingForm = new JustValidate(bookingForm, {
    errorFieldCssClass: "booking__input_invalid",
    successFieldCssClass: "booking__input_valid",
  });

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
