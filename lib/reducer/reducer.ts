import type { document as Document, project, User } from "@prisma/client";

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
  projects: Array<project>;
  currentProjectId: number;
  selectedProject: project;
  notificationMessageInfo: string;
  uploadProgress: number;
}

export interface Action {
  type: string;
  payload: any;
}

const reduce = (state: any, action: any) => {
  switch (action.type) {
    case ActionTypes.loadDocuments:
      return { ...state, documents: action.payload };
    case ActionTypes.loadProjects:
      const projectTmp = action.payload.find(
        (prj: project) => prj.id == state.currentProjectId
      );

      return {
        ...state,
        projects: action.payload,
        selectedProject: projectTmp,
      };
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

    case ActionTypes.setCurrentProjectId:
      const project =
        state.projects &&
        state.projects.find((prj: project) => prj.id == action.payload);

      return {
        ...state,
        currentProjectId: action.payload,
        selectedProject: project,
      };

    case ActionTypes.showInfo:
      return {
        ...state,
        notificationMessageInfo: action.payload,
      };

    case ActionTypes.setUploadProgress:
      return {
        ...state,
        uploadProgress: action.payload,
      };

    default:
      return state;
  }
};

export default reduce;
