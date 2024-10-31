import Stories from "../pages/stories/Stories";
import Edit from "../pages/studio/edit/Edit";
import Studio from "../pages/studio/Studio";
import { routeContants } from "../utils/RouteConstants";
export const ProtectedRoutes = [
    { path: routeContants.STUDIO, Component: <Studio /> },
    { path: routeContants.EDIT, Component: <Edit /> }
];
