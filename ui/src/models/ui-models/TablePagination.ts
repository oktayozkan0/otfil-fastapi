import { GetProp, TableProps } from "antd";
export type mdlTablePagination = Exclude<GetProp<TableProps, 'pagination'>, boolean>;
