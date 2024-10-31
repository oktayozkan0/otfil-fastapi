import { enmPdfExportType } from "../enums/PdfExportType";
import { enmPdfRendererType } from "../enums/PdfRenderer";
import { SFDynamicObject } from "./SFDynamicObject";

export type mdlPDFRendererProps = {
    params?: SFDynamicObject;
    rendererType?: enmPdfRendererType;
    type?: enmPdfExportType;
}
