import axios, { AxiosResponse } from "axios";
import { enmRequestType } from "../models/enums/requestType";
import { toast } from "react-toastify"; // Toast bildirimlerini içe aktar

// Sahte veri oluşturma fonksiyonu
const generateFakeResponse = <T>(requestType: enmRequestType): T => {
    switch (requestType) {
        case enmRequestType.GET:
            return { message: "Sahte GET yanıtı" } as unknown as T; // Örnek sahte veri
        case enmRequestType.POST:
            return { message: "Sahte POST yanıtı" } as unknown as T; // Örnek sahte veri
        case enmRequestType.PUT:
            return { message: "Sahte PUT yanıtı" } as unknown as T; // Örnek sahte veri
        case enmRequestType.DELETE:
            return { message: "Sahte DELETE yanıtı" } as unknown as T; // Örnek sahte veri
        case enmRequestType.PATCH:
            return { message: "Sahte PATCH yanıtı" } as unknown as T; // Örnek sahte veri
        default:
            return {} as T; // Geçersiz tür için boş bir nesne döndür
    }
};

export async function GetResponse<T>(
    requestType: enmRequestType,
    requestUrl: string,
    requestObj?: object
): Promise<T> {
    let apiUrl = "http://localhost:8000/api/v1/" + requestUrl;

    // Local storage veya başka bir kaynaktan token'ı al
    const token = localStorage.getItem('token'); // Token'ı buradan alıyorsun

    // Header'ı oluştur, Authorization ekleyerek
    const headers = {
        Authorization: `Bearer ${token}`,  // Bearer token olarak ekleniyor
    };

    try {
        let response: AxiosResponse<T>;

        switch (requestType) {
            case enmRequestType.GET:
                try {
                    response = await axios.get<T>(apiUrl, {
                        params: requestObj,
                        headers,
                    });
                } catch (error: any) {
                    toast.error(error.response?.data?.errors?.at(0));
                    return generateFakeResponse<T>(requestType); // Sahte veri döndür
                }
                break;
            case enmRequestType.POST:
                try {
                    response = await axios.post<T>(apiUrl, requestObj, {
                        headers,
                    });
                } catch (error: any) {
                    toast.error(error.response?.data?.errors?.at(0));
                    return generateFakeResponse<T>(requestType); // Sahte veri döndür
                }
                break;
            case enmRequestType.PUT:
                try {
                    response = await axios.put<T>(apiUrl, requestObj, {
                        headers,
                    });
                } catch (error: any) {
                    toast.error(error.response?.data?.errors?.at(0));
                    return generateFakeResponse<T>(requestType); // Sahte veri döndür
                }
                break;
            case enmRequestType.DELETE:
                try {
                    response = await axios.delete<T>(apiUrl, {
                        data: requestObj,
                        headers,
                    });
                } catch (error: any) {
                    toast.error(error.response?.data?.errors?.at(0));
                    return generateFakeResponse<T>(requestType); // Sahte veri döndür
                }
                break;
            case enmRequestType.PATCH:
                try {
                    response = await axios.patch<T>(apiUrl, requestObj, {
                        headers,
                    });
                } catch (error: any) {
                    toast.error(error.response?.data?.errors?.at(0));
                    return generateFakeResponse<T>(requestType); // Sahte veri döndür
                }
                break;
            default:
                toast.error("Geçersiz istek türü");
                return generateFakeResponse<T>(requestType); // Sahte veri döndür
        }

        return response.data;
    } catch (error: any) {
        toast.error("İstek sırasında bir hata oluştu: " + error.response?.data?.errors?.at(0));
        return generateFakeResponse<T>(enmRequestType.GET); // Sahte veri döndür
    }
}
