import type {
  file as fileModel,
  document as Document,
  User,
} from "@prisma/client";

import {
  useStateContext,
  useDispatchContext,
  useDispatchLaterContext,
} from "../lib/reducer/context";

import {
  actionChangeCurrentDocument as _actionChangeCurrentDocument,
  actionCreateNewDocument as _actionCreateNewDocument,
  actionChangeActiveTab as _actionChangeActiveTab,
  actionUpdateCurrentDocument as _actionUpdateCurrentDocument,
  actionLoadDocuments as _actionLoadDocuments,
  actionDeleteDocument as _actionDeleteDocument,
  actionRenderMenu as _actionRenderMenu,
  actionSignIn as _actionSignIn,
} from "./documents";

import {
  actionLoadProjects as _actionLoadProjects,
  actionSetCurrentProjectId as _actionSetCurrentProjectId,
} from "./projects";

import {
  actionFileUpload as _actionFileUpload,
  actionFileDownload as _actionFileDownload,
} from "./file";

import { actionChangeKeyword as _actionChangeKeyword } from "./search";

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const dispatchLater = useDispatchLaterContext();

  return {
    actionSignIn: (user: User, accessToken: string) => {
      _actionSignIn(state, dispatch, user, accessToken);
    },
    actionChangeCurrentDocument: (document: Document) => {
      _actionChangeCurrentDocument(state, dispatch, document);
    },
    actionUpdateCurrentDocument: (
      document: Document,
      disableAutoSave: boolean
    ) => {
      _actionUpdateCurrentDocument(state, dispatch, document, disableAutoSave);
    },
    actionCreateNewDocument: (projectId: number) => {
      _actionCreateNewDocument(state, dispatch, projectId);
    },
    actionChangeActiveTab: (tabName: string) => {
      _actionChangeActiveTab(state, dispatch, tabName);
    },
    actionLoadDocuments: (projectId: number) => {
      _actionLoadDocuments(state, dispatch, projectId);
    },
    actionDeleteDocument: (document: Document) => {
      _actionDeleteDocument(state, dispatch, document);
    },
    actionRenderMenu: () => {
      _actionRenderMenu(state, dispatch);
    },
    actionChangeKeyword: (keyword: string) => {
      _actionChangeKeyword(state, dispatch, keyword);
    },
    actionLoadProjects: () => {
      _actionLoadProjects(state, dispatch);
    },
    actionSetCurrentProjectId: (projectId: number) => {
      _actionSetCurrentProjectId(state, dispatch, projectId);
    },

    actionFileUpload: (file: File, documentId: number) => {
      _actionFileUpload(state, dispatch, file, documentId);
    },
    actionFileDownload: (file: fileModel) => {
      _actionFileDownload(state, dispatch, file);
    },
  };
};

export default component;
