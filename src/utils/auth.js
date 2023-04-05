import Cookies from "js-cookie";

// const TokenKey = "loginPhone";
const TokenKey = "account";
const RTokenKey = "refresh_token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {
    expires: 0.5,
    path: "/",
  });
}

export function setRToken(token) {
  return Cookies.set(RTokenKey, token, {
    expires: 0.5,
  });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function removeRToken() {
  return Cookies.remove(RTokenKey);
}
