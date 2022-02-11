function setCookie(key, value) {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);
  document.cookie = `${key}=${value}; expires= ${currentDate}`;
}

function getCookie(key) {
  const searchKey = `${key}=`;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const result = cookies.find((cookie) => cookie.includes(searchKey));
  if (result) {
    return result.split('=')[1];
  }
  return null;
}

function removeCookie(key) {
  document.cookie = `${key}=;`;
}

function clearAllCookie() {
  if (!document.cookie) return;
  const cookies = document.cookie.split('; ');
  cookies.forEach((cookie) => {
    document.cookie = `${cookie.split('=')[0]}=;`;
  });
}

function setStorage(key, value) {
  return localStorage.setItem(key, value);
}

function getStorage(key) {
  return localStorage.getItem(key);
}

function removeStorage(key) {
  return localStorage.removeItem(key);
}

function clearAllStorage() {
  return localStorage.clear();
}

export default {
  setCookie,
  getCookie,
  removeCookie,
  clearAllCookie,
  setStorage,
  getStorage,
  removeStorage,
  clearAllStorage
};
