
import { enmRequestType } from "../../models/enums/requestType";
import { mdlGetImageRequest } from "../../models/service-models/image/GetImageRequest";
import { mdlGetImageResponse } from "../../models/service-models/image/GetImageResponse";
import { GetResponse } from "../baseService";

export module ImageService {
    export async function Get(pRequest: mdlGetImageRequest): Promise<mdlGetImageResponse> {
        return await GetResponse<mdlGetImageResponse>(enmRequestType.GET, `images/${pRequest.image_id}`);
    }

}
