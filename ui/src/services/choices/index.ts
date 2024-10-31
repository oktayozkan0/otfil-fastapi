import { Choice } from "../../models/domain/choice";
import { enmRequestType } from "../../models/enums/requestType";
import { mdlChangePasswordRequest } from "../../models/service-models/auth/ChangePasswordRequest";
import { mdlChangePasswordResponse } from "../../models/service-models/auth/ChangePasswordResponse";
import { mdlLoginRequest } from "../../models/service-models/auth/LoginRequest";
import { mdlLoginResponse } from "../../models/service-models/auth/LoginResponse";
import { mdlMeRequest } from "../../models/service-models/auth/MeRequest";
import { mdlMeResponse } from "../../models/service-models/auth/MeResponse";
import { mdlRefreshRequest } from "../../models/service-models/auth/RefreshRequest";
import { mdlRefreshResponse } from "../../models/service-models/auth/RefreshResponse";
import { mdlCreateChoiceRequest } from "../../models/service-models/choices/CreateChoiceRequest";
import { mdlCreateChoiceResponse } from "../../models/service-models/choices/CreateChoiceResponse";
import { mdlDeleteChoiceRequest } from "../../models/service-models/choices/DeleteChoiceRequest";
import { mdlDeleteChoiceResponse } from "../../models/service-models/choices/DeleteChoiceResponse";
import { mdlGetChoicesRequest } from "../../models/service-models/choices/GetChoicesRequest";
import { mdlGetChoicesResponse } from "../../models/service-models/choices/GetChoicesResponse";
import { mdlUpdateChoiceRequest } from "../../models/service-models/choices/UpdateChoiceRequest";
import { mdlUpdateChoiceResponse } from "../../models/service-models/choices/UpdateChoiceResponse";
import { GetResponse } from "../baseService";


export module ChoiceService {
    export async function List(pRequest: mdlGetChoicesRequest): Promise<Choice[]> {
        return await GetResponse<Choice[]>(enmRequestType.GET, `stories/${pRequest.story_slug}/scenes/${pRequest.scene_slug}/choices`);
    }
    export async function Create(pRequest: mdlCreateChoiceRequest): Promise<mdlCreateChoiceResponse> {
        return await GetResponse<mdlCreateChoiceResponse>(enmRequestType.POST, `stories/${pRequest.story_slug}/scenes/${pRequest.scene_slug}/choices`, pRequest);
    }
    export async function Update(pRequest: mdlUpdateChoiceRequest): Promise<mdlUpdateChoiceResponse> {
        return await GetResponse<mdlUpdateChoiceResponse>(enmRequestType.PATCH, `stories/${pRequest.story_slug}/scenes/${pRequest.scene_slug}/choices/${pRequest.id}`, pRequest);
    }
    export async function Delete(pRequest: mdlDeleteChoiceRequest): Promise<mdlDeleteChoiceResponse> {
        return await GetResponse<mdlDeleteChoiceResponse>(enmRequestType.DELETE, `stories/${pRequest.story_slug}/scenes/${pRequest.scene_slug}/choices/${pRequest.id}`);
    }
}