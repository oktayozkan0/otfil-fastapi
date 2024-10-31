import axios from "axios";
import CookieManager from "./CookieManager";
import { ObjectHelper } from "./ObjectHelper";
import { mdlServiceResponse } from "../models/service-models/common/ServiceResponse";
import { mdlBaseResponse } from "../models/service-models/common/BaseResponse";
import { toast } from "react-toastify";

export async function GetResponse<T extends mdlServiceResponse<mdlBaseResponse>>(
  requestUrl: string,
  requestObj: object
): Promise<T> {
  let apiUrl = process.env.REACT_APP_API_ADDRESS;
  return await PostAsync<T>(
    apiUrl + "/" + requestUrl,
    JSON.stringify(requestObj)
  );
}

function PostAsync<T>(url: string, request: string) {
  return AsyncSend<T>("post", url, request);
}

async function AsyncSend<T>(
  type: string,
  url: string,
  request: string
): Promise<T> {
  return new Promise<T>(function (resolve, reject) {
    let token = CookieManager.get("authToken");
    try {
      axios({
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        method: type,
        url: `${url}`,
        data: request,
        timeout: 30000,
      })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            let typedResponse: T = response.data;
            resolve(typedResponse);
          } else {
            toast.error(response.headers.message);
            reject({
              status: response.status,
              statusText: response.statusText,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          var response = ObjectHelper.prepareResponseHeader("An error occured");
          resolve(response as T);
        });
    } catch (err) {
      console.log(err);
      var response = ObjectHelper.prepareResponseHeader("An error occured");
      resolve(response as T);
    }
  });
}
