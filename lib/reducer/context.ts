import { createContext, useContext, Dispatch } from "react";
import type { document as Document } from "@prisma/client";

import { GlobalState, Action } from "./reducer";

export const appStateContext = createContext<GlobalState>({
  documents: [],
  selectedDocument: {},
  triggerSave: false,
  activeTab: "preview",
  renderMenu: false,
  userSignedIn: null,
  accessToken: "",
});

export const dispatcherContext = createContext<Dispatch<Action>>(() => null);

export const useStateContext = () => {
  return useContext(appStateContext);
};

export const useDispatchContext = () => {
  return useContext(dispatcherContext);
};

export const useDispatchLaterContext = () => {
  const func = useContext(dispatcherContext);

  return (param: Action) => {
    setTimeout(() => func(param), 10);
  };
};
