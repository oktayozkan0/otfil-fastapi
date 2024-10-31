import { useTranslation } from "react-i18next";
import { LanguageDropdown } from "../common/LanguageDropdown";
import { UserDropdown } from "./UserDropdown";

export const HeaderTools = () => {
  const { t } = useTranslation();

  return (
    <div className="nk-header-tools">
      <ul className="nk-quick-nav">
        <LanguageDropdown />
        <UserDropdown />
      </ul>
    </div>
  );
};
