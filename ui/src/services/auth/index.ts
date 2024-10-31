
import { GetResponse } from "../baseService";

import axios, { AxiosResponse } from "axios";
import qs from "qs";
import { mdlSignupRequest } from "../../models/service-models/auth/SignupRequest";
import { mdlSignupResponse } from "../../models/service-models/auth/SignupResponse";
import { mdlLoginRequest } from "../../models/service-models/auth/LoginRequest";
import { mdlLoginResponse } from "../../models/service-models/auth/LoginResponse";
import { enmRequestType } from "../../models/enums/requestType";
import { mdlMeRequest } from "../../models/service-models/auth/MeRequest";
import { mdlMeResponse } from "../../models/service-models/auth/MeResponse";
import { mdlRefreshRequest } from "../../models/service-models/auth/RefreshRequest";
import { mdlRefreshResponse } from "../../models/service-models/auth/RefreshResponse";
import { mdlChangePasswordRequest } from "../../models/service-models/auth/ChangePasswordRequest";
import { mdlChangePasswordResponse } from "../../models/service-models/auth/ChangePasswordResponse";

export module AuthService {
    export async function SignUp(pRequest: mdlSignupRequest): Promise<mdlSignupResponse> {
        return await GetResponse<mdlSignupResponse>(enmRequestType.POST, 'auth/signup', pRequest);
    }

    export async function Login(pRequest: mdlLoginRequest): Promise<mdlLoginResponse> {
        const formData = qs.stringify(pRequest);
        try {
            const response = await axios.post<mdlLoginResponse>("http://localhost:8000/api/v1/auth/login", formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (response.data.access_token) {
                localStorage.setItem("token", response.data.access_token)
                Me(new mdlMeRequest())
            }

            return response.data as mdlLoginResponse;
        } catch (error) {

            return {} as mdlLoginResponse;

        }
    }

    export async function Me(pRequest: mdlMeRequest): Promise<mdlMeResponse> {
        var response = await GetResponse<mdlMeResponse>(enmRequestType.GET, 'auth/me', pRequest);
        return response;
    }

    export async function Refresh(pRequest: mdlRefreshRequest): Promise<mdlRefreshResponse> {
        return await GetResponse<mdlRefreshResponse>(enmRequestType.POST, 'auth/refresh', pRequest);
    }

    export async function ChangePassword(pRequest: mdlChangePasswordRequest): Promise<mdlChangePasswordResponse> {
        return await GetResponse<mdlChangePasswordResponse>(enmRequestType.POST, 'auth/change-password', pRequest);
    }
}
