import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TurkiyeFlag from "../assets/img/turkey.png";
import EnglandFlag from "../assets/img/uk.png";
import { LanguageDropdown } from "../components/common/LanguageDropdown";
import { enmDirection } from "../models/enums/Direction";
import { mdlLanguage } from "../models/ui-models/Language";
import { PrivacyPolicy_en, PrivacyPolicy_tr, TermsAndConditions_en, TermsAndConditions_tr } from "../consts/Texts";
import { SFModal } from "../components/elements/SFModal";

const Footer = () => {
  const { t, i18n } = useTranslation();

  const [openTermsAndContitions, setOpenTermsAndConditions] = useState<boolean>(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState<boolean>(false);

  const currentLanguage = i18n.language;

  const languageItems: Array<mdlLanguage> = [
    {
      icon: EnglandFlag,
      label: t("footer.english"),
      value: "en",
      default: true,
    },
    {
      icon: TurkiyeFlag,
      label: t("footer.turkce"),
      value: "tr",
      default: false,
    },
  ];

  useEffect(() => { }, []);

  const changeLanguage = (language: mdlLanguage) => {
    i18n.changeLanguage(language.value);
  };

  return (
    <Fragment>
      <div className="nk-footer nk-auth-footer-full">
        <div className="container wide-lg">
          <div className="row g-3">
            <div className="col-lg-6 order-lg-last">
              <ul className="nav nav-sm justify-content-center justify-content-lg-end">
                <li className="nav-item">
                  <a className="nav-link" onClick={() => setOpenTermsAndConditions(true)}>{t("footer.termsConditions")}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={() => setOpenPrivacyPolicy(true)}>{t("footer.privacyPolicy")}</a>
                </li>
                <LanguageDropdown direction={enmDirection.UP} />
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="nk-block-content text-center text-lg-left">
                <p className="text-soft">{t("footer.tradeMark")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SFModal
        width={window.innerWidth * 70 / 100}
        open={openTermsAndContitions}
        toggler={() => { setOpenTermsAndConditions(!openTermsAndContitions) }}
        body={currentLanguage == "en" ? <TermsAndConditions_en /> : <TermsAndConditions_tr />}
        title={t("common.termsAndConditions")}
      />
      <SFModal
        width={window.innerWidth * 50 / 100}
        open={openPrivacyPolicy}
        toggler={() => { setOpenPrivacyPolicy(!openPrivacyPolicy) }}
        body={currentLanguage == "en" ? <PrivacyPolicy_en /> : <PrivacyPolicy_tr />}
        title={t("common.privacyPolicy")}
      />
    </Fragment>
  );
};

export default Footer;
