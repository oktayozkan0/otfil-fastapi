import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { HtmlHelper } from "../utils/HtmlHelper";
import { useAppDispatch } from "../store/Hooks";
import { setMobile } from "../store/SiteSlice";
import HeaderMenu from "./HeaderMenu";

const GeneralLayout = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const dispatch = useAppDispatch();
  const isMobile = width <= 1024;

  useEffect(() => {
    HtmlHelper.removeBodyClass("pg-auth");
    if (isMobile) {
      dispatch(setMobile(true));
      HtmlHelper.addBodyClass("has-touch");
      HtmlHelper.addBodyClass("as-mobile");
    } else {
      HtmlHelper.addBodyClass("no-touch");
      dispatch(setMobile(false));
    }
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const handleWindowSizeChange = () => {
    window.innerWidth < 1024
      ? dispatch(setMobile(true))
      : dispatch(setMobile(false));
    setWidth(window.innerWidth);
  };

  return (
    <>
      <div className="nk-app-root">
        <div className="nk-main">
          <div className="nk-wrap">
            <HeaderMenu />
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
      <div id="backdropper" className="modal-backdrop fade hidden"></div>
    </>
  );
};

export default GeneralLayout;
