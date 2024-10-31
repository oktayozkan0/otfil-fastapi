import React, { useEffect } from "react";
import loadingGif from "../assets/img/loadingv2.gif";
import { useAppSelector } from "../store/Hooks";

const Overlay = () => {
  const siteSlice = useAppSelector((state) => state.site);

  useEffect(() => { }, [siteSlice.loading]);

  return (
    <>
      {siteSlice.loading && (
        <div id="overlay">
          <div className="spinner">
            <img src={loadingGif} width="100px" />
          </div>
        </div>
      )}
    </>
  );
};

export default Overlay;
