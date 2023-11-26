import { API_URL } from "./const.js";
import { Notification } from "./Notification.js";

export const getComedians = async () => {
  try {
    const response = await fetch(`${API_URL}/comedians`);
    if (!response.ok) {
      throw new Error(`Сервер вернул ошибку ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Возникла проблема с fetch-запросом: ${error.message}`);
    Notification.getInstance().show(`Возникла ошибка сервера. Попробуйте позже.`);
  }
};
