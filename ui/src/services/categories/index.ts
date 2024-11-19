
import { Category } from "../../models/domain/category";
import { enmRequestType } from "../../models/enums/requestType";
import { mdlCreateCategoriesRequest } from "../../models/service-models/categories/CreateCategoriesRequest";
import { mdlCreateCategoriesResponse } from "../../models/service-models/categories/CreateCategoriesResponse";
import { mdlGetCategoriesRequest } from "../../models/service-models/categories/GetCategoriesRequest";
import { GetResponse } from "../baseService";


export module ChoiceService {
    export async function List(pRequest: mdlGetCategoriesRequest): Promise<Category[]> {
        return await GetResponse<Category[]>(enmRequestType.GET, `categories`);
    }
    export async function Create(pRequest: mdlCreateCategoriesRequest): Promise<mdlCreateCategoriesResponse> {
        return await GetResponse<mdlCreateCategoriesResponse>(enmRequestType.POST, `categories`, pRequest);
    }

}