import { useEffect } from "react";
import { useAppSelector } from "../store/Hooks";
import Login from "../pages/auth/Login";
import { Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const siteStore = useAppSelector((store) => store.site);
  const isAuthenticated = siteStore.token;

  useEffect(() => { }, []);

  return <>{isAuthenticated ? <Outlet /> : <Login />}</>;
};
