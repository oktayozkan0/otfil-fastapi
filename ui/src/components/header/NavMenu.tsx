import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { logout, openMobileMenu } from "../../store/SiteSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Brand } from "../common/Brand";
import { routeDefinitions } from "../../utils/RouteDefinitions";
import { t } from "i18next";
import { InputHelper } from "../../utils/InputHelper";
import { routeContants } from "../../utils/RouteConstants";
import { mdlRoute } from "../../models/ui-models/Route";
import { PublicRoutes } from "../../routes/PublicRoutes";

const NavMenu = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const siteStore = useAppSelector((slice) => slice.site);
  const location = useLocation();


  useEffect(() => {
    if (InputHelper.isNullOrUndefinedOrEmpty(siteStore.token)) {
      dispatch(logout());
      navigate(routeContants.LOGIN);
    }

  }, [siteStore.token])

  useEffect(() => { }, [siteStore.isMobile, location]);

  const handleItemClick = (route: mdlRoute) => {
    if (route.path) navigate(route.path)
  };

  return (
    <div
      className={`nk-header-menu ms-auto ${siteStore.openMobileMenu ? "nk-header-active" : ""
        } ${siteStore.isMobile ? "mobile-menu" : ""}`}
      data-content="headerNav"
    >
      <div className="nk-header-mobile">
        <Brand className="nk-header-brand" />
        <div className="nk-menu-trigger me-n2">
          <a
            onClick={() => dispatch(openMobileMenu(false))}
            className="nk-nav-toggle nk-quick-nav-icon"
            data-target="headerNav"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
        </div>
      </div>
      <ul className="nk-menu nk-menu-main ui-s2">
        {routeDefinitions.filter(r => siteStore.user ? r : PublicRoutes.some(p => p.path == r.path)).map((route: mdlRoute, index: number) => (
          <li
            key={index}
            className={`nk-menu-item ${location.pathname == route.path ? "active current-page" : ""
              } ${route.items ? "has-sub" : ""}`}
          >
            <a
              onClick={() => handleItemClick(route)}
              className={`nk-menu-link`}
            >
              <span className="nk-menu-text">{t(route.label!)}</span>
              {route.items && (
                <FontAwesomeIcon className="ml-5" icon={faChevronDown} />
              )}
            </a>
            {route.items && (
              <ul className="nk-menu-sub">
                {route.items.map((subRoute: mdlRoute, subIndex: number) => (
                  <Fragment key={subIndex}>
                    <li
                      className={`nk-menu-item ${location.pathname == route.path
                        ? "active current-page"
                        : ""
                        } ${subRoute.items ? "has-sub" : ""}`}
                    >
                      <a
                        onClick={() => handleItemClick(subRoute)}
                        className="nk-menu-link"
                      >
                        <span className="nk-menu-text">
                          {t(subRoute.label!)}
                        </span>
                        {subRoute.items && (
                          <FontAwesomeIcon
                            className="ml-5"
                            icon={faChevronRight}
                          />
                        )}
                      </a>
                      {subRoute.items && (
                        <ul className="nk-menu-sub">
                          {subRoute.items.map(
                            (
                              subChildRoute: mdlRoute,
                              subChildIndex: number
                            ) => (
                              <li className="nk-menu-item" key={subChildIndex}>
                                <a
                                  onClick={() => handleItemClick(subChildRoute)}
                                  className="nk-menu-link"
                                >
                                  <span>{t(subChildRoute.label!)}</span>
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </li>
                  </Fragment>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavMenu;
