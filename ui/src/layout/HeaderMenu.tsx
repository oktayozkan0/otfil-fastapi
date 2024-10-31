import NavMenu from "../components/header/NavMenu";
import { MobileMenuSwitcher } from "../components/header/MobileMenuSwitcher";
import { Brand } from "../components/common/Brand";
import { HeaderTools } from "../components/header/HeaderTools";

const HeaderMenu = () => {
  return (
    <div className="nk-header is-light">
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <MobileMenuSwitcher />
          <Brand className="nk-header-brand" />
          <NavMenu />
          <HeaderTools />
        </div>
      </div>
    </div>
  );
};

export default HeaderMenu;
