import type { document as Document } from "@prisma/client";

import { User } from "next-auth";

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
    actionCreateNewDocument: () => {
      _actionCreateNewDocument(state, dispatch);
    },
    actionChangeActiveTab: (tabName: string) => {
      _actionChangeActiveTab(state, dispatch, tabName);
    },
    actionLoadDocuments: () => {
      _actionLoadDocuments(state, dispatch);
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
  };
};

export default component;
