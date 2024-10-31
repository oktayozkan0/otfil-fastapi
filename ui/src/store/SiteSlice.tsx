import { createSlice } from "@reduxjs/toolkit";
import CookieManager from "../utils/CookieManager";
import { InputHelper } from "../utils/InputHelper";
import { enmExportStatus } from "../models/enums/ExportStatus";
import { mdlPDFRendererProps } from "../models/ui-models/PDFRendererProps";
import { enmPdfExportType } from "../models/enums/PdfExportType";
import { mdlUser } from "../models/domain/user";

interface IinitialState {
  user: mdlUser | undefined;
  token: string | undefined;
  loading: boolean;
  openMobileMenu: boolean;
  isMobile: boolean;
  darkMode: boolean;
  language: string;
  pdfExportObject: mdlPDFRendererProps | undefined;
  exportStatus: enmExportStatus;
  printStatus: enmExportStatus;
}

const initialState: IinitialState = {
  user: !InputHelper.isNullOrUndefinedOrEmpty(CookieManager.get("user"))
    ? JSON.parse(CookieManager.get("user"))
    : undefined,
  token: !InputHelper.isNullOrUndefinedOrEmpty(CookieManager.get("authToken"))
    ? CookieManager.get("authToken")
    : undefined,
  loading: false,
  openMobileMenu: false,
  isMobile: window.innerWidth <= 1024,
  darkMode:
    !InputHelper.isNullOrUndefinedOrEmpty(CookieManager.get("darkMode"))
      ? CookieManager.get("darkMode")
      : false,
  language:
    !InputHelper.isNullOrUndefinedOrEmpty(CookieManager.get("language"))
      ? CookieManager.get("language")
      : "en",
  exportStatus: enmExportStatus.DONE,
  pdfExportObject: undefined,
  printStatus: enmExportStatus.DONE
};

const siteSlice = createSlice({
  name: "site",
  initialState,
  reducers: {
    setUser: (state = initialState, action) => {
      state.user = action.payload as mdlUser;
      CookieManager.set("user", JSON.stringify(state.user), 0, 6);
      return state;
    },
    logout: (state) => {
      state.user = undefined;
      CookieManager.remove("authToken");
      CookieManager.remove("user");
    },
    setToken: (state = initialState, action) => {
      state.token = action.payload;
      CookieManager.set("authToken", state.token!, 0, 6);
      return state;
    },
    toLoading: (state) => {
      state.loading = true;
    },
    toUnLoading: (state) => {
      state.loading = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      CookieManager.set("darkMode", String(state.darkMode));
    },
    openMobileMenu: (state, action) => {
      state.openMobileMenu = action.payload;
    },
    setMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      CookieManager.set("language", state.language);
    },
    setPdfExportObject: (state, action) => {
      if (action.payload != null) {
        if (action.payload.type == enmPdfExportType.PDF) {
          state.exportStatus = enmExportStatus.REQUESTED;
        }
        else {
          state.printStatus = enmExportStatus.REQUESTED;
        }
        state.pdfExportObject = action.payload;
      }
      else {
        state.exportStatus = enmExportStatus.DONE;
        state.printStatus = enmExportStatus.DONE;
        state.pdfExportObject = undefined;
      }
      return state;
    },
  },
});

export const {
  setUser,
  toLoading,
  toUnLoading,
  openMobileMenu,
  setMobile,
  setToken,
  toggleDarkMode,
  logout,
  setLanguage,
  setPdfExportObject,
} = siteSlice.actions;
export default siteSlice.reducer;
