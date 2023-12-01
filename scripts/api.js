import { API_URL } from './const.js';
import { Notification } from './Notification.js';

export const getComedians = async () => {
  try {
    const response = await fetch(`${API_URL}/comedians`);
    if (!response.ok) {
      throw new Error(`Сервер вернул ошибку ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Возникла проблема с fetch-запросом: ${error.message}`);
    Notification.getInstance().show(
      `Возникла ошибка сервера. Попробуйте позже.`,
    );
  }
};

export const getClient = async (ticket) => {
  try {
    const response = await fetch(`${API_URL}/clients/${ticket}`);
    if (!response.ok) {
      throw new Error(`Сервер вернул ошибку ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Возникла проблема с fetch-запросом: ${error.message}`);
    Notification.getInstance().show(`Возникла ошибка сервера. Попробуйте позже.`);
  }
};

export const sendData = async (method, data, id) => {
  try {
    const response = await fetch(`${API_URL}/clients${id ? `/${id}` : ''}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Сервер вернул ошибку ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Возникла проблема с fetch-запросом: ${error.message}`);
    Notification.getInstance().show(
      `Возникла ошибка сервера. Попробуйте позже.`,
    );
    return false;
  }
};
