
import { enmRequestType } from "../../models/enums/requestType";
import { mdlCreateSceneRequest } from "../../models/service-models/scenes/CreateSceneRequest";
import { mdlCreateSceneResponse } from "../../models/service-models/scenes/CreateSceneResponse";
import { mdlDeleteSceneRequest } from "../../models/service-models/scenes/DeleteSceneRequest";
import { mdlDeleteSceneResponse } from "../../models/service-models/scenes/DeleteSceneResponse";
import { mdlGetSceneRequest } from "../../models/service-models/scenes/GetSceneRequest";
import { mdlGetSceneResponse } from "../../models/service-models/scenes/GetSceneResponse";
import { mdlGetScenesRequest } from "../../models/service-models/scenes/GetScenesRequest";
import { mdlGetScenesResponse } from "../../models/service-models/scenes/GetScenesResponse";
import { mdlUpdateSceneRequest } from "../../models/service-models/scenes/UpdateSceneRequest";
import { mdlUpdateSceneResponse } from "../../models/service-models/scenes/UpdateSceneResponse";
import { GetResponse } from "../baseService";

export module SceneService {
    export async function List(pRequest: mdlGetScenesRequest): Promise<mdlGetScenesResponse> {
        return await GetResponse<mdlGetScenesResponse>(enmRequestType.GET, `stories/${pRequest.game_slug}/scenes?limit=50&offset=0`);
    }
    export async function Update(pRequest: mdlUpdateSceneRequest): Promise<mdlUpdateSceneResponse> {
        return await GetResponse<mdlUpdateSceneResponse>(enmRequestType.PATCH, `stories/${pRequest.story_slug}/scenes/${pRequest.scene_slug}`, pRequest);
    }
    export async function Delete(pRequest: mdlDeleteSceneRequest): Promise<mdlDeleteSceneResponse> {
        return await GetResponse<mdlDeleteSceneResponse>(enmRequestType.DELETE, `stories/${pRequest.story_slug}/scenes/${pRequest.scene_slug}`);
    }
    export async function Create(pRequest: mdlCreateSceneRequest): Promise<mdlCreateSceneResponse> {
        return await GetResponse<mdlCreateSceneResponse>(enmRequestType.POST, `stories/${pRequest.story_slug}/scenes`, pRequest);
    }
    export async function Detail(pRequest: mdlGetSceneRequest): Promise<mdlGetSceneResponse> {
        return await GetResponse<mdlCreateSceneResponse>(enmRequestType.GET, `stories/${pRequest.story_slug}/scenes/${pRequest.slug}`);
    }
}
