// const axios = require("axios");

import axios, * as others from 'axios';
const getToken = () => {
  console.log("fffffffffffffffff",localStorage.getItem("_ria") || sessionStorage.getItem("_ria"))
    return localStorage.getItem("_ria") || sessionStorage.getItem("_ria");
};
export const GET = async (url) => {
  const response = await axios.get(
    process.env.REACT_APP_API_BASE_URL + url,
    {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    }
  );
  return response.data;
};

export const POST = async (url,body) => {
    const response = await axios({
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + url,
      headers: {
        Authorization: "Bearer " + getToken(),
      },

      data: body,
    });
    return response.data;
};
  
export const PUT = async (url,body) => {
    const response = await axios({
      method: "put",
      url: process.env.REACT_APP_API_BASE_URL + url,
      headers: {
        Authorization: "Bearer " + getToken(),
      },

      data: body,
    });
    return response.data;
};
  