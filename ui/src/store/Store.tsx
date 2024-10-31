import { combineReducers, configureStore } from "@reduxjs/toolkit";
import SiteSlice from "./SiteSlice";

const rootReducer = combineReducers({
  site: SiteSlice,
});

export const store = configureStore({
  reducer: rootReducer
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
