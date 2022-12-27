import fetch from "isomorphic-fetch";
const API = process.env.NEXT_PUBLIC_API;

export const getAllPagesFromUser = (skip, limit, token) => {
  return fetch(`${API}/pagesFromUser/?skip=${skip}&limit=${limit}`, {
    method: "GET",
    headers: token
      ? {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getAllPages = (skip, limit) => {
  return fetch(`${API}/pages/?skip=${skip}&limit=${limit}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deletePage = (slug, token) => {
  return fetch(`${API}/page/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getSinglePage = (slug, token) => {
  return fetch(`${API}/page/${slug}`, {
    method: "GET",
    headers: token
      ? {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const makePage = (data, token) => {
  return fetch(`${API}/page`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updatePage = (slug, token, data) => {
  return fetch(`${API}/page/${slug}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

// export const voteFeature = (featureId, token) => {
//   console.log("like");
//   return fetch(`${API}/feature/vote/${featureId}`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
