import TurkiyeFlag from "../assets/img/turkey-sq.png";
import EnglandFlag from "../assets/img/uk-sq.png";
import { mdlLanguage } from "../models/ui-models/Language";

export const languages: Array<mdlLanguage> = [
  {
    icon: EnglandFlag,
    label: "language.english",
    value: "en",
    default: true,
  },
  {
    icon: TurkiyeFlag,
    label: "language.turkish",
    value: "tr",
    default: false,
  },
];
