import "./App.css";
import Overlay from "./layout/Overlay";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useAppSelector } from "./store/Hooks";
import { useTranslation } from "react-i18next";
import { HtmlHelper } from "./utils/HtmlHelper";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import { ConfigProvider, theme } from "antd";
const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const store = useAppSelector((state) => state.site);
  const { i18n } = useTranslation();
  const queryClient = new QueryClient()

  useEffect(() => {
    store.darkMode
      ? HtmlHelper.addBodyClass("dark-mode")
      : HtmlHelper.removeBodyClass("dark-mode");
    store.openMobileMenu
      ? HtmlHelper.addBodyClass("nav-shown")
      : HtmlHelper.removeBodyClass("nav-shown");
    if (store.language != i18n.language) i18n.changeLanguage(store.language);
  }, [store.darkMode, store.openMobileMenu, store.language]);
  return (
    <React.StrictMode>
      <ConfigProvider theme={{ algorithm: store.darkMode ? darkAlgorithm : defaultAlgorithm }}>
        <QueryClientProvider client={queryClient}>
          <Overlay />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </QueryClientProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}

export default App;
