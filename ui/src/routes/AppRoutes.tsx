import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { PublicRoutes } from "./PublicRoutes";
import GeneralLayout from "../layout/GeneralLayout";
import { PrivateRoute } from "./PrivateRoute";
import HeaderMenu from "../layout/HeaderMenu";

const AppRoutes = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {PublicRoutes.map(({ path, Component }, i) => (
          <Route element={<GeneralLayout />} key={i}>

            <Route path={path} element={Component} />
          </Route>

        ))}
        <Route element={<PrivateRoute />}>
          {ProtectedRoutes.map(({ path, Component }, i: number) => (
            <Route element={<GeneralLayout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
