import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { setLanguage, toggleDarkMode } from "../../store/SiteSlice";
import { enmDirection } from "../../models/enums/Direction";
import { HtmlHelper } from "../../utils/HtmlHelper";
import { mdlLanguage } from "../../models/ui-models/Language";
import { languages } from "../../consts/Languages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "antd";

export type LanguageDropdownProps = {
  direction?: enmDirection;
}

export const LanguageDropdown = (props: LanguageDropdownProps) => {
  const { t, i18n } = useTranslation();
  const siteStore = useAppSelector((store) => store.site);
  const dispatch = useAppDispatch();
  const selector = "language-dropdown";

  const [open, setOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<mdlLanguage>();

  useEffect(() => {
    if (siteStore.language && siteStore.language != selectedLanguage?.value) {
      var languageItem = _.find(languages, function (language) {
        return language.value == siteStore.language;
      });
      if (languageItem != null) {
        setSelectedLanguage(languageItem);
      }
    }
    return HtmlHelper.clickOutside(selector, open, setOpen);
  }, [siteStore.language, open]);

  const changeLanguage = (language: mdlLanguage) => {
    setOpen(false);
    dispatch(setLanguage(language.value));
  };

  const getSelectedLanguageFlag = () => {
    if (selectedLanguage) {
      return selectedLanguage.icon;
    }
    return _.find(languages, function (language) {
      return language.default == true;
    })?.icon;
  };

  return (
    <>
      <li className="dropdown language-dropdown d-none d-sm-block me-n1">

        <a
          id={selector}
          className={`dropdown-toggle nk-quick-nav-icon ${open ? "show" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <div className="quick-icon border border-light">
            <img className="icon" src={getSelectedLanguageFlag()} />
          </div>
        </a>
        <div
          className={`dropdown-menu dropdown-menu-end dropdown-menu-s1 language-drop ${open ? "show" : ""
            }
        ${props.direction ? "open-up" : ""}
        `}
        >
          <ul className="language-list">
            {languages.map((language: mdlLanguage, index: number) => (
              <li key={index}>
                <a
                  onClick={() => changeLanguage(language)}
                  className="language-item"
                >
                  <img src={language.icon} className="language-flag" />
                  <span className="language-name">{t(language.label!)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>
      <li className="dropdown language-dropdown d-none d-sm-block me-n1">

        <a
          id={selector}
          className={`dropdown-toggle nk-quick-nav-icon`}
          onClick={() => dispatch(toggleDarkMode())}
        >
          <div className="quick-icon ">
            <FontAwesomeIcon icon={siteStore.darkMode ? faSun : faMoon} />
          </div>
        </a>

      </li>
    </>
  );
};
