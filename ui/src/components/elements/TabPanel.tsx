import { useEffect, useState } from "react";
import _ from "lodash";

export class tabModel {
    label?: string;
    content: React.ReactNode;
    code?: string;
    display?: boolean;
}

export type TabPanelProps = {
    tabItems?: Array<tabModel>;
    activeTab?: number;
    fnChangeActiveTab?: Function;
    autoShowFirstItem?: boolean;
}

export const TabPanel = (props: TabPanelProps) => {
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
    if(props.autoShowFirstItem || props.activeTab ){
        let _activeTab = props.activeTab ?? 0;
        const activeItem = props.tabItems?.[_activeTab];
        if(activeItem != undefined && activeItem.display != undefined && !activeItem.display){
            _activeTab = _.findIndex(props.tabItems, (e) => {
                return e.display == undefined || e.display;
            }, 0);
        }
        setActiveTab(_activeTab);
    }
  }, [props]);
  const fnChangeActiveTab = (index: number) => {
    props.fnChangeActiveTab && props.fnChangeActiveTab(index);
    setActiveTab(index);
  };

  return (
    <>
        <div className='tab-panel search-panel'>
            <ul className='nav nav-tabs nav-tabs-mb-icon nav-tabs-card'>
                {props.tabItems?.map((item, index) => {
                    return <>
                        {
                            (item.display == undefined || item.display) &&
                            <li key={index} className={`tab nav-item ${activeTab === index ? "selected" : ""} ${item.code!}`} onClick={() => fnChangeActiveTab?.(index)}>
                                <a className={`nav-link  ${activeTab === index ? "active" : ""}`} >{item.label}</a>
                            </li> 
                        }
                    </>
                })}
            </ul>
            <div className="py-4">
                {props.tabItems?.[activeTab]?.content && props.tabItems[activeTab]?.content}
            </div>
        </div>
    </>
)
};
