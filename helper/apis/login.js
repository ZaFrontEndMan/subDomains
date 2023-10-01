import axios from "auth/axiosInstance";
import config from "config/config";

// userLogin (login)
export const userLogin = async (data) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/account/user/login`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// userLogin (login)
export const userSetPassword = async (data) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/user/password/reset`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// userForgetPassword (ForgetPassword)
export const userForgetPassword = async (data) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/user/password/forgot`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// userVerifyCode (VerifyCode)
export const userVerifyCode = async (data) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/user/password/verify`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// loginVerify (VerifyCode)
export const loginVerify = async (data) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/account/user/login/verify`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
