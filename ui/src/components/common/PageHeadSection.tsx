import { faBars, faFileExport, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { HeaderButton } from "../../models/ui-models/HeaderButton";
import _ from "lodash";

export type PageHeaderSectionProps = {
  pageTitle?: string;
  pageDescription?: string;
  exportFunction?: Function;
  addNewFunction?: Function;
  buttons?: Array<HeaderButton>;
}

export const PageHeaderSection = (props: PageHeaderSectionProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="nk-block-head nk-block-head-sm">
      <div className="nk-block-between">
        <div className="nk-block-head-content">
          {props.pageTitle && (
            <h3 className="nk-block-title page-title">{props.pageTitle}</h3>
          )}
          {props.pageDescription && (
            <div className="nk-block-des text-soft">
              <p>{props.pageDescription}</p>
            </div>
          )}
        </div>
        {(props.exportFunction || props.addNewFunction || (props.buttons && props.buttons.length > 0)) && (
          <div className="nk-block-head-content">
            <div className="toggle-wrap nk-block-tools-toggle">
              <a
                onClick={() => setExpanded(!expanded)}
                className={`btn btn-icon btn-trigger toggle-expand me-n1 ${expanded ? "active" : ""
                  }`}
              >
                <FontAwesomeIcon icon={faBars} />
              </a>
              <div
                className={`toggle-expand-content ${expanded ? "expanded" : ""
                  }`}
              >
                <ul className="nk-block-tools g-3">
                  <li>
                    {
                      props.exportFunction
                      &&
                      <a
                        onClick={() =>
                          props.exportFunction && props.exportFunction()
                        }
                        className="btn btn-white btn-dim btn-outline-primary"
                      >
                        <FontAwesomeIcon icon={faFileExport} />

                        <span className="ml-5">{t("common.export")}</span>
                      </a>
                    }
                    {
                      props.buttons && props.buttons.map((button, index) => (
                        <a key={index} onClick={() => button.fnFunction && button.fnFunction()} className={`me-2 ${button.className}`}>
                          {
                            button.icon &&
                            <FontAwesomeIcon icon={button.icon} />
                          }
                          <span className="ml-5">{button.title}</span>
                        </a>
                      ))
                    }
                    {
                      props.addNewFunction
                      &&
                      <a
                        onClick={() =>
                          props.addNewFunction && props.addNewFunction()
                        }
                        className="btn btn-white btn-dim btn-outline-primary"
                      >
                        <FontAwesomeIcon icon={faPlus} />

                        <span className="ml-5">{t("common.addNew")}</span>
                      </a>
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <hr />
    </div>
  );
};
