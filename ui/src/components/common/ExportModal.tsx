import { Button, Skeleton, Transfer, TransferProps } from "antd";
import { useState } from "react";
import ExportHelper from "../../utils/ExportHelper";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { enmPdfExportType } from "../../models/enums/PdfExportType";
import { useTranslation } from "react-i18next";
import { enmExportModalType } from "../../models/enums/ExportModalType";
import { useAppDispatch } from "../../store/Hooks";
import { setPdfExportObject } from "../../store/SiteSlice";

interface TransferDataType {
  key: string;
  title: string;
  description: string;
}

export type ExportModalProps = {
  type?:enmExportModalType;
  pdfType?:enmPdfExportType;
  name: string;
  data?: object[];
  fnModalClose?:Function;
}

export const ExportModal = (props: ExportModalProps) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const getHeads = ():TransferDataType[] => {
        const firstItem = _.first(props.data) as object;
        return Object.keys(firstItem).map<TransferDataType>((x, i) => ({
          key: x,
          title: x,
          description: '',
        }));
    }
  
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>();
    const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);
    const onSelectChange: TransferProps['onSelectChange'] = (
      sourceSelectedKeys,
      targetSelectedKeys,
    ) => {
      setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const onChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
      setTargetKeys(nextTargetKeys);
    };

    const fnExport = () => {
        if(!targetKeys || targetKeys.length == 0){
            return;
        }
        const heads = targetKeys?.map<string>((x) => x.toString())
        if(!heads){
            return;
        }
        const rows = props.data?.map((obj:any) => heads.map((x:string)=> obj[x]));
        if(!rows){
            return;
        }
        if(props.type && props.type == enmExportModalType.PDFTable){
            const pdfProps = ExportHelper.exportToPDFTable(`${props.name}`, props.pdfType ?? enmPdfExportType.PDF,heads ,rows);
            dispatch(setPdfExportObject(pdfProps));
        }
        else{
            ExportHelper.exportToExcel(`${props.name}`,heads ,rows)
        }
    };

    const fnCloseModal = () => {
        props.fnModalClose && props.fnModalClose();
    };
    
    return (
        <div className="row">
            
        {
            !props.data || props.data?.length == 0
            &&
            <>
                <div className="col-md-12">
                    <Skeleton active />
                    <Skeleton active />
                </div>
            </>
        }
        {
            !props.data
            &&
            <>
                <div className="col-md-12 mt-2">
                    <div className="alert alert-warning alert-icon">
                        <FontAwesomeIcon icon={ faWarning } />
                        <span className="ps-4">Data not found.</span>
                    </div>
                </div>
            </>
        }
        {
            props.data && props.data.length > 0
            &&
            <>
            <div className="col-md-12">
                <Transfer
                dataSource={getHeads()}
                titles={['Source', 'Target']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                render={(item) => item.title}
                />
            </div>
            <div className="col-md-12 mt-4 text-end">
                <Button className="btn btn-secondary btn-dim me-2 " onClick={fnExport}>{props.type && props.type == enmExportModalType.PDFTable ? t("common.exportToPDF") : t("common.exportToExcel")}</Button>
                <Button className="btn btn-danger btn-dim me-2 " onClick={fnCloseModal}>{t("common.close")}</Button>
            </div>
            </>
        }
        </div>
    );
};
