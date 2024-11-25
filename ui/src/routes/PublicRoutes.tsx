import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Demo from "../pages/demo/Demo";
import Stories from "../pages/stories/Stories";
import GameScreen from "../pages/story/GameScreen";
import { routeContants } from "../utils/RouteConstants";

export const PublicRoutes = [
  { path: routeContants.STORIES, Component: <Stories /> },
  { path: routeContants.HOME, Component: <Stories /> },
  { path: routeContants.LOGIN, Component: <Demo /> },
  { path: routeContants.REGISTER, Component: <Register /> },
  { path: routeContants.STORY, Component: <GameScreen /> }

];
