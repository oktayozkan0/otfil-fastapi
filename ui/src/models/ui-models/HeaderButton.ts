import { IconDefinition } from "@fortawesome/fontawesome-common-types";

export type HeaderButton = {
    title?: string;
    icon?:IconDefinition;
    fnFunction?:Function;
    className?:string;
}