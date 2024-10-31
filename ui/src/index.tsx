import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./assets/css/dashlite.min.css";
import "./assets/css/theme.css";
import { Provider } from "react-redux";
import { store } from "./store/Store";
import "./utils/i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
