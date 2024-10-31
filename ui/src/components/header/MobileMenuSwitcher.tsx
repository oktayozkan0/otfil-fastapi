import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { openMobileMenu } from "../../store/SiteSlice";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const MobileMenuSwitcher = () => {
  const dispatch = useAppDispatch();
  const siteStore = useAppSelector((store) => store.site);

  return (
    <div className="nk-menu-trigger me-sm-2 d-lg-none">
      <a
        onClick={() => dispatch(openMobileMenu(!siteStore.openMobileMenu))}
        className={`nk-nav-toggle nk-quick-nav-icon ${
          siteStore.openMobileMenu ? "toggle-active" : ""
        }`}
        data-target="headerNav"
      >
        <FontAwesomeIcon icon={faBars} />
      </a>
    </div>
  );
};
