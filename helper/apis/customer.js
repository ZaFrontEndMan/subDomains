import axios from "auth/axiosInstance";
import config from "config/config";

const addCustomer = async (formData, corporateUUID) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/customer`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data
}
const getCustomer = async (corporateUUID, customerUUID) => {
  const response = await axios({
    method: "GET",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/customer/${customerUUID}`,
  });
  return response.data
}
const assignCustomer = async (data, corporateUUID) => {
  const response = await axios({
    method: "PATCH",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/customer/assign`,
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data
}

const addCustomerLimit = async (data, corporateUUID) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/limit`,
    data: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data
}
const editCustomer = async (formData, corporateUUID, customerUUID) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/customer/${customerUUID}`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data
}


const customerLicenseScan = async (formData) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/auth/license/scan`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data
}

export {
  addCustomer,
  editCustomer,
  addCustomerLimit,
  assignCustomer,
  getCustomer,
  customerLicenseScan
}