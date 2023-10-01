import axios from "auth/axiosInstance";
import config from "config/config";

export const fetch = async (carUUID) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/supplier/business/car/${carUUID}/show`,
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.data
}
export const fetchManfactures = async () => {
  const response = await axios({
    method: "GET",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/supplier/vehicle/maker/list`,
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.data
}
export const fetchVehicle = async (year, manufacturer) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/supplier/vehicle/list`,
    data: {
      vehicle: {
        year,
      },
      vehicle_maker: {
        uuid: manufacturer,
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.data
}
export const fetchYears = async (manufacturer) => {
  const response = await axios({
    method: "POST",
    url: `${config.apiGateway.API_URL_TELGANI}/v2/supplier/vehicle/year/list`,
    data: {
      vehicle_maker: {
        uuid: manufacturer
      }
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.data
}




