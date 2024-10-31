import { mdlRoute } from "../models/ui-models/Route";
import { routeContants } from "./RouteConstants";

export const routeDefinitions: Array<mdlRoute> = [
  {
    path: routeContants.STORIES,
    label: "route.stories",
  },
  {
    path: routeContants.STUDIO,
    label: "route.studio",
  }
];
