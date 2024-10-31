import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Stories from "../pages/stories/Stories";
import StoryPage from "../pages/story/Story";
import { routeContants } from "../utils/RouteConstants";

export const PublicRoutes = [
  { path: routeContants.STORIES, Component: <Stories /> },
  { path: routeContants.LOGIN, Component: <Login /> },
  { path: routeContants.REGISTER, Component: <Register /> },
  { path: routeContants.STORY, Component: <StoryPage /> }

];
