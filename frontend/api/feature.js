import fetch from "isomorphic-fetch";
const API = process.env.NEXT_PUBLIC_API;

export const getAllFeaturesOfPage = (skip, limit, token, pageId) => {
  return fetch(`${API}/features/${pageId}/?skip=${skip}&limit=${limit}`, {
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
export const getAllFeatures = (skip, limit) => {
  return fetch(`${API}/features/?skip=${skip}&limit=${limit}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getAllFeaturesFromUser = (skip, limit, token) => {
  return fetch(`${API}/featuresFromUser/?skip=${skip}&limit=${limit}`, {
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
export const deleteFeature = (slug, token) => {
  return fetch(`${API}/feature/${slug}`, {
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

export const getSingleFeature = (slug, token) => {
  return fetch(`${API}/feature/${slug}`, {
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

export const makeFeature = (data, token, pageId) => {
  return fetch(`${API}/feature/${pageId}`, {
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

export const updateFeature = (slug, token, data) => {
  return fetch(`${API}/feature/${slug}`, {
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

export const voteFeature = (featureId, token) => {
  // console.log("token", token);
  // console.log("commentId", commentId);
  console.log("like");
  return fetch(`${API}/feature/vote/${featureId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
