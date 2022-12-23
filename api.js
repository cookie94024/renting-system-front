import axios from "axios";

export const api = () =>
  axios.create({
    headers: {
      Authorization: "Token " + window.localStorage.getItem("token"),
    },
  });
