import { CSSProperties, useEffect } from "react";
import { HtmlHelper } from "../../utils/HtmlHelper";
import { Modal } from "antd";

export type SFModalProps = {
  open: boolean;
  name?: string;
  toggler: Function;
  title?: string;
  body?: JSX.Element;
  footer?: () => JSX.Element;
  width?: number;
  style?: CSSProperties;
}

export const SFModal = (props: SFModalProps) => {
  useEffect(() => {
    if (props.open) {
      HtmlHelper.addBodyClass("modal-open");
    }
  }, [props.open]);

  const handleModalClose = () => {
    HtmlHelper.removeBodyClass("modal-open");
    props.toggler && props.toggler();
  };

  return (

    <Modal
      style={props.style}
      title={props.title}
      footer={props.footer ? props.footer : <></>}
      className={`fade ${props.open ? "show" : ""}`}
      open={props.open}
      onCancel={handleModalClose}
      onClose={handleModalClose}
      width={props.width}
    >
      {props.body && props.body}
    </Modal>
  );
};
