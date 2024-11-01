import { memo, useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faMoon,
  faRightFromBracket,
  faSign,
  faSignHanging,
  faSliders,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout, toggleDarkMode } from "../../store/SiteSlice";
import { InputHelper } from "../../utils/InputHelper";
import { HtmlHelper } from "../../utils/HtmlHelper";
import { Switch } from "antd";

export interface UserDropdownProps {
  itemClickCallback?: () => void; // Specify the function signature for clarity
}

export const UserDropdown = memo(({ itemClickCallback }: UserDropdownProps) => {
  const siteStore = useAppSelector((state) => state.site);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const selector = "user-dropdown";

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    return HtmlHelper.clickOutside(selector, open, setOpen);
  }, [open]);

  const handleItemClick = () => {
    itemClickCallback?.();
  };

  const handleSignOut = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]); // Ensure dependencies are added

  return (
    <li className="dropdown user-dropdown">
      {
        siteStore.user ? (
          <a
            onClick={() => setOpen((prev) => !prev)}
            className="dropdown-toggle"
            id={selector}
          >
            <div className="user-toggle">
              <div className="user-avatar sm">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
          </a>
        ) : (
          <div className="auth-icons d-flex">

            <a href="/register" className="signup">
              {t("login.howCanIWrite")}
            </a>
          </div >
        )
      }

      <div
        className={`dropdown-menu dropdown-menu-md dropdown-menu-end dropdown-menu-s1 is-light user-drop ${open ? "show" : ""}`}
      >
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card">
            <div className="user-avatar">
              {siteStore.user?.first_name && siteStore.user?.last_name ? (
                <span>
                  {InputHelper.getFirstLetters(
                    siteStore.user.first_name,
                    siteStore.user.last_name
                  )}
                </span>
              ) : (
                <span>{siteStore.user?.email?.toUpperCase().slice(0, 2)}</span>
              )}
            </div>
            <div className="user-info">
              {siteStore.user?.first_name && siteStore.user?.last_name ? (
                <span className="lead-text">{`${siteStore.user.first_name} ${siteStore.user.last_name}`}</span>
              ) : (
                <span className="lead-text">
                  {siteStore.user?.email?.split("@")[0]}
                </span>
              )}
              {siteStore.user?.email && (
                <span className="sub-text">{siteStore.user.email}</span>
              )}
            </div>
            <div className="user-action">
              <a
                className="btn btn-icon me-n2"
                onClick={handleItemClick} // Updated to use handleItemClick
              >
                {/* Uncomment and use the settings icon if needed */}
                {/* <FontAwesomeIcon icon={faCog} /> */}
              </a>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <ul className="link-list">
            <li>
              <a className="pointer">
                <FontAwesomeIcon icon={faMoon} />
                <span className="icon-item-label">
                  {t("userMenu.darkMode")}
                </span>
                <Switch className="menu-toggler" checked={siteStore.darkMode} onChange={() => dispatch(toggleDarkMode())} />
              </a>
            </li>
            <li>
              <a className="pointer" onClick={handleSignOut}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span className="icon-item-label">{t("userMenu.signOut")}</span>
              </a>
            </li>

          </ul>
        </div>
      </div>
    </li >
  );
});
