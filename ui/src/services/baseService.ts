import axios, { AxiosResponse } from "axios";
import { enmRequestType } from "../models/enums/requestType";
import { toast } from "react-toastify"; // Toast bildirimlerini içe aktar

// Sahte veri oluşturma fonksiyonu
const generateFakeResponse = <T>(requestType: enmRequestType): T => {
    const fakeMessages: any = {
        [enmRequestType.GET]: "Sahte GET yanıtı",
        [enmRequestType.POST]: "Sahte POST yanıtı",
        [enmRequestType.PUT]: "Sahte PUT yanıtı",
        [enmRequestType.DELETE]: "Sahte DELETE yanıtı",
        [enmRequestType.PATCH]: "Sahte PATCH yanıtı",
    };
    return { message: fakeMessages[requestType] || "Sahte yanıt" } as unknown as T;
};

export async function GetResponse<T>(
    requestType: enmRequestType,
    requestUrl: string,
    requestObj?: any,
    isFormData: boolean = false
): Promise<T> {
    const apiUrl = `http://localhost:8000/api/v1/${requestUrl}`;
    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    };

    try {
        let response: AxiosResponse<T>;

        switch (requestType) {
            case enmRequestType.GET:
                response = await axios.get<T>(apiUrl, {
                    params: requestObj,
                    headers,
                });
                break;
            case enmRequestType.POST:
                response = await axios.post<T>(
                    apiUrl,
                    isFormData ? requestObj : JSON.stringify(requestObj),
                    { headers }
                );
                break;
            case enmRequestType.PUT:
                response = await axios.put<T>(apiUrl, requestObj, { headers });
                break;
            case enmRequestType.DELETE:
                response = await axios.delete<T>(apiUrl, {
                    data: requestObj,
                    headers,
                });
                break;
            case enmRequestType.PATCH:
                response = await axios.patch<T>(apiUrl, requestObj, { headers });
                break;
            default:
                toast.error("Geçersiz istek türü");
                return generateFakeResponse<T>(requestType);
        }

        return response.data;
    } catch (error: unknown) {
        const errorMessage =
            (error as any)?.response?.data?.errors?.[0] || "Bilinmeyen bir hata oluştu.";
        toast.error(`İstek sırasında bir hata oluştu: ${errorMessage}`);
        return generateFakeResponse<T>(requestType); // Sahte veri döndür
    }
}
