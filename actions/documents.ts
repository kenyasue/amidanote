import { createContext, useContext, Dispatch } from "react";
import type { document as Document } from "@prisma/client";
import { GlobalState, Action } from "../lib/reducer/reducer";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { User } from "next-auth";
import { ActionTypes } from "../lib/reducer/actionTypes";
import Utils from "../lib/util";
import * as notificationActions from "./notifications";

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
  dispatch: Dispatch<Action>,
  projectId: number
) => {
  if (!projectId) return;

  const documentResponse = await axios({
    method: "get",
    url: `/api/document?project=${projectId}`,
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
    payload: state.documents.find((doc) => doc.id == document.id),
  });

  isDocumentChanged = false;

  if (document) window.history.replaceState(null, "", `?doc=${document.id}`);
};

export const actionCreateNewDocument = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  projectId: number
) => {
  // event listers
  const documentResponse = await axios({
    method: "post",
    url: "/api/document",
    headers: {
      acceesstoken: state.accessToken,
    },
    data: {
      projectId: projectId,
      title: `New Document`,
      markdown: "",
    },
  });

  await actionLoadDocuments(state, dispatch, projectId);

  dispatch({
    type: ActionTypes.setCurrentDocument,
    payload: documentResponse.data,
  });

  actionChangeActiveTab(state, dispatch, "edit");

  window.history.replaceState(null, "", `?doc=${documentResponse.data.id}`);
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

  console.log("saved");
  notificationActions.showInfo(state, dispatch, "Document saved");

  actionUpdateCurrentDocument(state, dispatch, document, true);
};

export const actionUpdateCurrentDocument = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  document: Document,
  disableAutoSave: boolean
) => {
  if (!disableAutoSave) isDocumentChanged = true;

  // switch instance in the case active document is not belongs to the document list ary
  const documentList: Array<Document> = state.documents;
  const docInstance = documentList.find((doc) => doc.id === document.id);
  if (docInstance) {
    // replace instances
    if (docInstance !== document) {
      documentList[documentList.indexOf(docInstance)] = document;

      dispatch({
        type: ActionTypes.loadDocuments,
        payload: documentList,
      });
    }
  }

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

  actionLoadDocuments(state, dispatch, document.projectId);
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
