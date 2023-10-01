import axios from "auth/axiosInstance";
import config from "config/config";

const getCorporatesList = async () => {
  try {
    const req = await axios.get(`${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate`)
    return req.data
  } catch (error) {
    return error
  }
}
const addCorporate = async (formData) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data
}
const editCorporate = async (formData, uuid) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${uuid}`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data
}
const addCorporateLimit = async (data, uuid) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${uuid}/limit`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data
}
const addCoordinator = async (data, uuid) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${uuid}/coordinator`,
    data: JSON.stringify({ ...data, dashboard_url: document.location.origin }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data
}
const editCoordinator = async (data, corporateUUID, coordinatorUUID) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/coordinator/${coordinatorUUID}`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data
}
const deleteCoordinator = async (corporateUUID, coordinatorUUID) => {
  const response = await axios({
    method: "DELETE",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/coordinator/${coordinatorUUID}`,
  });
  return response.data
}



const registrationRequest = async (formData) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/registration-request`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data
}

export {
  getCorporatesList,
  addCorporate,
  editCorporate,
  addCorporateLimit,
  addCoordinator,
  editCoordinator,
  deleteCoordinator,

  registrationRequest
}
