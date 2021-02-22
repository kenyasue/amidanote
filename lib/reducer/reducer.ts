import type { document as Document } from "@prisma/client";
import { User } from "next-auth";

import { ActionTypes } from "./actionTypes";

export interface GlobalState {
  selectedDocument: any | Document;
  triggerSave: Boolean; // use to call save function from anywhare
  activeTab: string;
  documents: Array<Document>;
  renderMenu: Boolean;
  userSignedIn: User;
  accessToken: string;
  documentSearchKeyword: string;
}

export interface Action {
  type: string;
  payload: any;
}

const reduce = (state: any, action: any) => {
  switch (action.type) {
    case ActionTypes.loadDocuments:
      return { ...state, documents: action.payload };
    case ActionTypes.setCurrentDocument:
      return { ...state, selectedDocument: { ...action.payload } };
    case ActionTypes.triggerSave:
      return { ...state, triggerSave: !state.triggerSave };
    case ActionTypes.setActiveTab:
      return { ...state, activeTab: action.payload };
    case ActionTypes.renderMenu:
      return { ...state, renderMenu: !state.renderMenu };
    case ActionTypes.signIn:
      return {
        ...state,
        userSignedIn: action.payload.user,
        accessToken: action.payload.accessToken,
      };

    case ActionTypes.typeKeyword:
      return { ...state, documentSearchKeyword: action.payload };

    default:
      return state;
  }
};

export default reduce;
