import { createContext, useContext, Dispatch } from "react";
import type { document as Document } from "@prisma/client";
import { GlobalState, Action } from "../lib/reducer/reducer";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { User } from "next-auth";
import { ActionTypes } from "../lib/reducer/actionTypes";
import Utils from "../lib/util";

export const actionChangeKeyword = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  keyword: string
) => {
  dispatch({
    type: ActionTypes.typeKeyword,
    payload: keyword,
  });
};
