import fetch from "isomorphic-fetch";
import cookie from "js-cookie";
import Router from "next/router";
const API = process.env.NEXT_PUBLIC_API;

export const signup = (user) => {
  console.log(API);
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signin = (user) => {
  console.log(API);
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const authenticate = (data, next) => {
  //setting cookie
  if (process.browser) {
    cookie.set("token", data.token, {
      expires: 1,
    });
    // setting local storage
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  next();
};

export const isAuth = () => {
  if (process.browser) {
    if (cookie.get("token")) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      }
    }
  }
};

export const getCookie = (key) => {
  if (process.browser) {
    return cookie.get(key);
  }
};
export const signout = (next) => {
  cookie.remove("token");
  localStorage.removeItem("user");
  return next();
  // return fetch(`${API}/signout`, {
  //   method: "GET",
  // })
  //   .then((response) => {
  //     return console.log("signout done");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

export const updateAuth = (user, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      // let auth = JSON.parse(localStorage.getItem("user"));
      // auth = user;
      // aise bhi kaam kar rha hai
      localStorage.setItem("user", JSON.stringify(user));
      next();
    }
  }
};
