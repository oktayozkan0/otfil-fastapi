import otfilLogo from "../../assets/img/otfil.png";

export const Logo = () => {
  return (
    <img
      className="logo-img"
      src={otfilLogo}
      width={"40px"}
      height={"40px"}
      style={{ maxWidth: "100vw" }}
      alt="logo"
    />
  );
};
