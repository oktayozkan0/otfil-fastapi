import _ from 'lodash';
import { InputHelper } from './InputHelper';
import * as XLSX from 'xlsx'
import { enmPdfRendererType } from '../models/enums/PdfRenderer';
import { mdlPDFRendererProps } from '../models/ui-models/PDFRendererProps';
import { enmPdfExportType } from '../models/enums/PdfExportType';

module ExportHelper {
    export function exportToPDFTable (fileName: string, type:enmPdfExportType, heads:string[], rows:string[][]){
    return {
        params: { name: fileName , heads: heads, rows:rows },
        rendererType: enmPdfRendererType.PDFTable,
        type: type
    } as mdlPDFRendererProps
  }

  export function exportToExcel(fileName: string, tableHead: string[], rowData?: (string | undefined)[][]) {
    const sheetName = fileName.length > 31 ? fileName.substring(0, 31) : fileName;
    let worksheet = XLSX.utils.json_to_sheet([]);
    const headerRow = tableHead || [];
    worksheet = XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(worksheet, rowData || [], { origin: -1 });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  }
}
export default ExportHelper;
