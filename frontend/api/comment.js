import fetch from "isomorphic-fetch";
const API = process.env.NEXT_PUBLIC_API;

// export const getSingleFeature = (slug) => {
//   return fetch(`${API}/feature/${slug}`, {
//     method: "GET",
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// export const getAllFeature = () => {
//   return fetch(`${API}/feature/list`, {
//     method: "GET",
//     // headers: {
//     //   Accept: "application/json",
//     //   "Content-Type": "application/json",
//     // },
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export const getAllComments = (featureId, token, skip, limit) => {
  return fetch(`${API}/comment/${featureId}/?skip=${skip}&limit=${limit}`, {
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

export const makeComment = (data, token, featureId) => {
  return fetch(`${API}/comment/${featureId}`, {
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

export const updateComment = (content, token, commentId) => {
  return fetch(`${API}/comment/${commentId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteComment = (token, commentId) => {
  return fetch(`${API}/uncomment/${commentId}`, {
    method: "DELETE",
    headers: {
      // Accept: "application/json",
      // "Content-Type": "application/json",
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

export const voteComment = (commentId, token) => {
  // console.log("token", token);
  // console.log("commentId", commentId);
  console.log("like");
  return fetch(`${API}/comment/vote/${commentId}`, {
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

export const getAllCommentReplies = (commentId, token, skip, limit) => {
  return fetch(
    `${API}/comment/reply/${commentId}/?skip=${skip}&limit=${limit}`,
    {
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
    }
  )
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const makeCommentReply = (data, token, commentId) => {
  // console.log(data, token, commentId);
  return fetch(`${API}/comment/reply/${commentId}`, {
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

export const deleteCommentReply = (token, commentReplyId) => {
  return fetch(`${API}/comment/reply/${commentReplyId}`, {
    method: "DELETE",
    headers: {
      // Accept: "application/json",
      // "Content-Type": "application/json",
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
export const updateCommentReply = (content, token, commentReplyId) => {
  return fetch(`${API}/comment/reply/${commentReplyId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const voteCommentReply = (commentReplyId, token) => {
  // console.log("token", token);
  // console.log("commentId", commentId);
  console.log("like");
  return fetch(`${API}/comment/reply/vote/${commentReplyId}`, {
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
