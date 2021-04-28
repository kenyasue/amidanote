import { createContext, useContext, Dispatch } from "react";
import type { document as Document } from "@prisma/client";
import { GlobalState, Action } from "../lib/reducer/reducer";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { User } from "next-auth";
import { ActionTypes } from "../lib/reducer/actionTypes";
import Utils from "../lib/util";

export const actionLoadProjects = async (
  state: GlobalState,
  dispatch: Dispatch<Action>
) => {
  if (!state.accessToken) return;

  const documentResponse = await axios({
    method: "get",
    url: "/api/project",
    headers: {
      acceesstoken: state.accessToken,
    },
  });

  dispatch({
    type: ActionTypes.loadProjects,
    payload: documentResponse.data,
  });
};

export const actionSetCurrentProjectId = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  projectId: number
) => {
  dispatch({
    type: ActionTypes.setCurrentProjectId,
    payload: projectId,
  });
};
