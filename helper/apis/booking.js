import axios from "auth/axiosInstance";
import config from "config/config";


// ***********************************Bookings***********************************

// accept requests
export const getBook = async (bookingUUID) => {
  const response = await axios({
    method: "GET",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/booking/${bookingUUID}/preview`,
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });
  return response.data;
};

// accept requests
export const withPayment = async (data) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/booking/store/with-payment`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
export const payment = async (data, uuid) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v1/booking/${uuid}/pay`,
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// accept requests
export const acceptRequests = async (uuid) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/booking/${uuid}/accept`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// approve requests
export const approveRequests = async (uuid, body) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/booking/${uuid}/cancellation/approve`,
    data: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// ADMIN reject requests
export const adminRejectRequests = async (uuid, data) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/booking/${uuid}/cancel`,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
// reject requests
export const rejectRequests = async (uuid, data) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/booking/${uuid}/cancel`,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
// extend requests
export const extendRequest = async (uuid, data) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/coordinator/booking/${uuid}/extend`,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};


export const getAllCars = async (filters) => {
  const response = await axios({
    method: "GET",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/car`,
    params: {
      ...filters
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;

};
export const getSelectedCar = async (data, uuid) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/car/${uuid}`,
    params: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;

};

export const getFilters = async () => {
  const response = await axios({
    method: "GET",
    url: `${config.apiGateway.API_URL_TELGANI}/v1/car-filters`,
  });
  return response.data;

};
// ***********************************_______***********************************
