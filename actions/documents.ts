import { createContext, useContext, Dispatch } from "react";
import type { document as Document } from "@prisma/client";
import { GlobalState, Action } from "../lib/reducer/reducer";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { User } from "next-auth";
import { ActionTypes } from "../lib/reducer/actionTypes";
import Utils from "../lib/util";

let isDocumentChanged = false;

export const actionSignIn = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  user: User,
  accessToken: string
) => {
  dispatch({
    type: ActionTypes.signIn,
    payload: {
      user,
      accessToken,
    },
  });
};

export const actionLoadDocuments = async (
  state: GlobalState,
  dispatch: Dispatch<Action>
) => {
  const documentResponse = await axios({
    method: "get",
    url: "/api/document",
    headers: {
      acceesstoken: state.accessToken,
    },
  });

  dispatch({
    type: ActionTypes.loadDocuments,
    payload: documentResponse.data,
  });
};

export const actionChangeCurrentDocument = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  document: Document
) => {
  actionChangeActiveTab(state, dispatch, "preview");

  dispatch({
    type: ActionTypes.setCurrentDocument,
    payload: document,
  });

  isDocumentChanged = false;
};

export const actionCreateNewDocument = async (
  state: GlobalState,
  dispatch: Dispatch<Action>
) => {
  // event listers
  const documentResponse = await axios({
    method: "post",
    url: "/api/document",
    headers: {
      acceesstoken: state.accessToken,
    },
    data: {
      title: `New Document`,
      markdown: "",
    },
  });

  /*
  const document: Document = {
    id: documentResponse.data.id,
    title: documentResponse.data.title,
    markdown: documentResponse.data.markdown,
    createdAt: documentResponse.data.createdAt,
    modifiedAt: documentResponse.data.modifiedAt,
  };
  */

  await actionLoadDocuments(state, dispatch);
  actionChangeActiveTab(state, dispatch, "edit");
};

export const actionChangeActiveTab = (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  tabName: string
) => {
  dispatch({
    type: ActionTypes.setActiveTab,
    payload: tabName,
  });

  if (isDocumentChanged) {
    console.log("Auto save");
    isDocumentChanged = false;
    actionSaveCurrentDocument(state, dispatch, state.selectedDocument);
  }
};

export const actionSaveCurrentDocument = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  document: Document
) => {
  const documentResponse = await axios({
    method: "put",
    url: `/api/document/${document.id}`,
    headers: {
      acceesstoken: state.accessToken,
    },
    data: {
      title: document.title,
      markdown: document.markdown,
    },
  });
};

export const actionUpdateCurrentDocument = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  document: Document,
  disableAutoSave: boolean
) => {
  if (!disableAutoSave) isDocumentChanged = true;

  dispatch({
    type: ActionTypes.setCurrentDocument,
    payload: document,
  });
};

export const actionDeleteDocument = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  document: Document
) => {
  const documentResponse = await axios({
    method: "delete",
    url: `/api/document/${document.id}`,
    headers: {
      acceesstoken: state.accessToken,
    },
  });

  dispatch({
    type: ActionTypes.setActiveTab,
    payload: "preview",
  });

  isDocumentChanged = false;

  actionLoadDocuments(state, dispatch);
};

export const actionRenderMenu = async (
  state: GlobalState,
  dispatch: Dispatch<Action>
) => {
  dispatch({
    type: ActionTypes.renderMenu,
    payload: null,
  });
};
