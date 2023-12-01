import QRCode from "qrcode";
import { Notification } from "./Notification.js";

const displayQRCode = (data) => {
  let error = false;

  const modal = document.querySelector(".modal");
  const qrCanvas = document.getElementById("qrCanvas");
  const modalClose = document.querySelector(".modal__close");

  QRCode.toCanvas(qrCanvas, data, (err) => {
    if (err) {
      error = true;
      console.error(err);
      return;
    }
    console.log("QRCode создан");
  });

  if (error) {
    Notification.getInstance().show('Что-то пошло не так. Попробуйте позже.');
    return;
  }

  modal.classList.add("modal_show");

  window.addEventListener("click", (e) => {
    if (e.target === modalClose || e.target === modal) {
      modal.classList.remove("modal_show");
      qrCanvas.getContext("2d").clearRect(0, 0, qrCanvas.width, qrCanvas.height);
    }
  });
};

export const showQrController = (bookingPerformance) => {
  bookingPerformance.addEventListener("click", ({ target }) => {
    if (target.closest(".booking__hall-btn")) {
      const bookingData = target.dataset.booking;
      displayQRCode(bookingData);
    }
  });
};
