import axios from "auth/axiosInstance";
import config from "config/config";

// Get all registration Settlements

export const addSettlement = async (formData, corporateUUID) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/settlement/create`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data
}
// ***********************************registrationRequest***********************************

// accept requests
export const acceptRequests = async (uuid, siteUrl) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/registration-request/${uuid}/accept`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ dashboard_url: document.location.origin })
  });
  return response.data;
};
// reject requests
export const rejectRequests = async (uuid) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/registration-request/${uuid}/reject`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// ***********************************_______***********************************
