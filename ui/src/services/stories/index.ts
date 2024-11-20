import { enmRequestType } from "../../models/enums/requestType";
import { mdlCreateStoryRequest } from "../../models/service-models/stories/CreateStoryRequest";
import { mdlCreateStoryResponse } from "../../models/service-models/stories/CreateStoryResponse";
import { mdlDeleteStoryRequest } from "../../models/service-models/stories/DeleteStoryRequest";
import { mdlDeleteStoryResponse } from "../../models/service-models/stories/DeleteStoryResponse";
import { mdlGetStoriesRequest } from "../../models/service-models/stories/GetStoriesRequest";
import { mdlGetStoriesResponse } from "../../models/service-models/stories/GetStoriesResponse";
import { mdlGetStoryRequest } from "../../models/service-models/stories/GetStoryRequest";
import { mdlGetStoryResponse } from "../../models/service-models/stories/GetStoryResponse";
import { mdlImageUploadRequest } from "../../models/service-models/image/ImageUploadRequest";
import { mdlUpdateStoryRequest } from "../../models/service-models/stories/UpdateStoryRequest";
import { mdlUpdateStoryResponse } from "../../models/service-models/stories/UpdateStoryResponse";
import { GetResponse } from "../baseService";


export module StoryService {
    export async function List(pRequest: mdlGetStoriesRequest): Promise<mdlGetStoriesResponse> {
        return await GetResponse<mdlGetStoriesResponse>(enmRequestType.GET, `stories?limit=${pRequest.limit}&offset=${pRequest.offset}`);
    }
    export async function Detail(pRequest: mdlGetStoryRequest): Promise<mdlGetStoryResponse> {
        return await GetResponse<mdlGetStoryResponse>(enmRequestType.GET, `stories/${pRequest.slug}`);
    }
    export async function Create(pRequest: mdlCreateStoryRequest): Promise<mdlCreateStoryResponse> {
        return await GetResponse<mdlCreateStoryResponse>(enmRequestType.POST, `stories`, pRequest);
    }
    export async function Update(pRequest: mdlUpdateStoryRequest): Promise<mdlUpdateStoryResponse> {
        return await GetResponse<mdlUpdateStoryResponse>(enmRequestType.PATCH, `stories/${pRequest.slug}`, pRequest);
    }
    export async function Delete(pRequest: mdlDeleteStoryRequest): Promise<mdlDeleteStoryResponse> {
        return await GetResponse<mdlDeleteStoryResponse>(enmRequestType.DELETE, `stories/${pRequest.slug}`);
    }
    export async function Me(pRequest: mdlGetStoriesRequest): Promise<mdlGetStoriesResponse> {
        return await GetResponse<mdlGetStoriesResponse>(enmRequestType.GET, `stories/me?limit=${pRequest.limit}&offset=${pRequest.offset}`);
    }
    export async function ImageUpload(pRequest: mdlImageUploadRequest): Promise<any> {
        return await GetResponse<any>(enmRequestType.POST, `stories/${pRequest.story_slug}/upload`, pRequest.image, true);
    }

}