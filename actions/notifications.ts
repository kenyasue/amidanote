import { createContext, useContext, Dispatch } from "react";
import { GlobalState, Action } from "../lib/reducer/reducer";
import { ActionTypes } from "../lib/reducer/actionTypes";

export const showInfo = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  text: string
) => {
  dispatch({
    type: ActionTypes.showInfo,
    payload: text,
  });

  setTimeout(() => {
    dispatch({
      type: ActionTypes.showInfo,
      payload: null,
    });
  }, 100);
};
