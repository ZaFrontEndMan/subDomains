import axios from "auth/axiosInstance";
import config from "config/config";

const configuration = async (UUIDS) => {
  const response = await axios({
    method: "PUT",
    url: `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/configuration`,
    data: { company_uuids: UUIDS },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data
}


export {
  configuration,



}